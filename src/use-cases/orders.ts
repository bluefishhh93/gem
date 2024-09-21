'use server';
import { UpdateOrderInput } from "@/app/(private)/admin/orders/action";
import { InsufficientProductQuantityError } from "@/app/util";
import { createOrder, getOrderById, getOrders, updateOrder } from "@/data-access/orders";
import { checkIneficient, getProductById } from "@/data-access/products";
import moment from "moment";
import { PaymentMethod, PaymentStatus, ShippingStatus, OrderStatus } from "@/types/enums";


export async function checkIneficientUseCase(cartItems: {

    productId: number;
    quantity: number;
}[]) {
    const insufficientProducts = await checkIneficient(cartItems);
    return insufficientProducts;
}

export async function getProductByIdUseCase(id: number) {
    const product = await getProductById(id);
    return product;
}

export async function createOrderUseCase(orderData: {
    userId?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    district: string;
    ward: string;
    paymentMethod: string;
    trackingNumber?: string;
    orderItems: {
        productId: number;
        quantity: number;
        subtotal: number;
    }[]

}) {
    //validate product current quantity
    const insufficientProducts = await checkIneficient(orderData.orderItems);
    if (insufficientProducts.length > 0) {
        throw new InsufficientProductQuantityError();
    }
    const date = new Date();
    const orderId = parseInt(moment(date).format("DDHHmmss"));

    if (!orderData.userId) {
        orderData.userId = parseInt(moment(date).format("DDHHmmss"));
    }

    const total = orderData.orderItems.reduce((acc, item) => acc + item.subtotal, 0);
    const shipAddress = `${orderData.address}, ${orderData.district}, ${orderData.ward}`;
    const order = await createOrder({
        orderData: {
            id: orderId,
            userId: orderData.userId,
            name: orderData.name,
            email: orderData.email,
            phone: orderData.phone,
            total: total,
            shipAddress: shipAddress,
            trackingNumber: orderData.trackingNumber,
            paymentMethod: orderData.paymentMethod as PaymentMethod,
            paymentStatus: orderData.paymentMethod === PaymentMethod.COD ? PaymentStatus.PENDING : PaymentStatus.PAID,
            shippingStatus: ShippingStatus.PENDING,
        },
        orderItemsData: orderData.orderItems
    });

    return order;
}

export async function getOrderByIdUseCase(id: number) {
    const order = await getOrderById(id);
    console.log(order);
    return order;
}

export async function updateOrderUseCase(id: number, orderData: Omit<UpdateOrderInput, 'orderId'>) {
    const order = await updateOrder(id, orderData);
    return order;
}

export async function getOrdersUseCase() {
    const orders = await getOrders();
    return orders;
}
