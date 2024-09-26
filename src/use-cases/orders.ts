'use server';
import { Order } from "@/db/schema";
import { PaymentMethod, PaymentStatus, ShippingStatus } from "@/types/enums";
import { InsufficientProductQuantityError } from "@/app/util";
import { createOrder, getOrderById, getOrders, updateOrder } from "@/data-access/orders";
import { checkIneficient, getProductById } from "@/data-access/products";
import { CustomBracelet } from "@/hooks/use-cart-store";
import moment from "moment";

interface CreateOrderInput {
    userId?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    district: string;
    ward: string;
    paymentMethod: string;
    trackingNumber?: string;
    orderItems?: OrderItem[];
    customBracelets?: CustomBracelet[];
}

interface OrderItem {
    productId: number;
    quantity: number;
    subtotal: number;
}

export async function checkIneficientUseCase(cartItems: { productId: number; quantity: number; }[]) {
    return await checkIneficient(cartItems);
}

export async function getProductByIdUseCase(id: number) {
    return await getProductById(id);
}

export async function createOrderUseCase({orderData, customBracelets}: {orderData: CreateOrderInput, customBracelets?: CustomBracelet[]}): Promise<Order> {
    
    if (orderData.orderItems?.length) {
        const insufficientProducts = await checkIneficient(orderData.orderItems);
        if (insufficientProducts.length > 0) {
            throw new InsufficientProductQuantityError();
        }
    }

    const orderId = generateOrderId();
    const userId = orderData.userId || generateUserId();
    const total = calculateTotal(orderData.orderItems, customBracelets);
    const shipAddress = formatShipAddress(orderData);

    console.log(total, 'total');
    console.log(customBracelets, 'customBracelets');

    try {
        return await createOrder({
            orderData: {
                id: orderId,
                userId,
                name: orderData.name,
                email: orderData.email,
                phone: orderData.phone,
                total ,
                shipAddress,
                trackingNumber: orderData.trackingNumber,
                paymentMethod: orderData.paymentMethod as PaymentMethod,
                paymentStatus: determinePaymentStatus(orderData.paymentMethod),
                shippingStatus: ShippingStatus.PENDING,
            },
            orderItemsData: orderData.orderItems,
            customBraceletData: customBracelets?.map(bracelet => ({
                id: bracelet.id,
                orderId,
                stringId: bracelet.stringType.id,
                price: bracelet.price,
                quantity: bracelet.quantity,
                charms: bracelet.charms.map(charm => ({
                    id: charm.id,
                    position: charm.position
                }))
            }))
        });
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order', { cause: error });
    }
}

export const getOrderByIdUseCase = getOrderById;
export const updateOrderUseCase = updateOrder;
export const getOrdersUseCase = getOrders;

function generateOrderId(): number {
    return parseInt(moment().format("DDHHmmss"));
}

function generateUserId(): number {
    return parseInt(moment().format("DDHHmmss"));
}

function calculateTotal(orderItems?: OrderItem[], customBracelets?: CustomBracelet[]): number {
    const itemsTotal = orderItems?.reduce((acc, item) => acc + item.subtotal, 0) ?? 0;
    const braceletTotal = customBracelets?.reduce((acc, bracelet) => acc + (bracelet.price * bracelet.quantity), 0) ?? 0;
    return itemsTotal + braceletTotal;
}

function formatShipAddress({address, district, ward}: CreateOrderInput): string {
    return `${address}, ${district}, ${ward}`;
}

function determinePaymentStatus(paymentMethod: string): PaymentStatus {
    return paymentMethod === PaymentMethod.COD ? PaymentStatus.PENDING : PaymentStatus.PAID;
}