'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { calculateShippingFeeAction, checkoutWithCOD, checkoutWithPayos, checkoutWithVNPay } from "../actions";
import { useAddressData } from "@/hooks/use-address-data";
import { CartItemType, ProductType, useCartStore } from "@/hooks/use-cart-store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputFieldCustom } from "./InputFieldCustom";
import SelectFieldCustom from "./SelectFieldCustom";
import Image from 'next/image';
import { vietnamCurrency } from '@/util/util';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import CustomBraceletImage from '@/components/custom-bracelet-image';
import { calculateTotal } from '@/app/util';
import { useShippingFee } from '@/hooks/use-shipping-fee';
import { debounce } from 'lodash';

const checkoutFormSchema = z.object({
  name: z.string().trim().min(1, "Tên không được để trống"),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^\d{10}$/, "Số điện thoại không hợp lệ"),
  address: z.string().trim().min(1, "Địa chỉ không hợp lệ"),
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  paymentMethod: z.enum(["cod", "vnpay", "payos"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
  ward: z.string().trim().min(1, "Vui lòng chọn phường/xã"),
  district: z.string().trim().min(1, "Vui lòng chọn quận/huyện"),
});

export const CheckoutForm = ({
  user
}: {
  user: {
    id?: number;
    displayName?: string | null | undefined;
    image?: string | null | undefined;
    role?: "user" | "admin" | undefined;
    email?: string | null | undefined;
  } | undefined;
}) => {
  const { districts, wards, fetchDistricts, fetchWards } = useAddressData();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [districtId, setDistrictId] = useState(0);
  const [wardCode, setWardCode] = useState("");
  const { cart, customBracelets, clearCart, setCheckoutPayload } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchDistricts(203);
  }, []);

  const getItemList = useCallback((cart: ProductType[]): CartItemType[] => {
    return cart.map((item: ProductType) => ({
      name: item.name,
      productId: item.id,
      quantity: item.quantity,
      subtotal: item.salePrice * item.quantity,
    }));
  }, []);


  const form = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: user?.displayName || "",
      phone: "",
      email: user?.email || "",
      paymentMethod: "cod",
      address: "",
      district: "",
      ward: "",
    },
  });

  const { execute, error, isPending } = useServerAction(
    paymentMethod === "cod" ? checkoutWithCOD : checkoutWithPayos,
    {
      onSuccess: () => {
        // clearCart();
      },
      onError: ({ err }) => {
        toast({
          variant: "error",
          title: 'Đặt hàng thất bại',
          description: `Có lỗi xảy ra, vui lòng thử lại sau, ${err.message || ''}`,
        });
      }
    }
  );

  const calculateTotalWeight = useMemo(() => {
    const cartItemsWeight = cart.reduce((total, item) => total + item.quantity, 0) * 200;
    const customBraceletsWeight = customBracelets.reduce((total, item) => total + item.quantity, 0) * 200;
    return cartItemsWeight + customBraceletsWeight;
  }, [cart, customBracelets]);

  const { shippingFee, isLoading: isLoadingShippingFee } = useShippingFee(districtId, wardCode, 203, calculateTotalWeight);

  const handleDistrictChange = useCallback(async (districtId: number) => {
    await fetchWards(districtId);
    form.setValue("ward", "");
    setDistrictId(districtId);
    setWardCode("");
  }, [fetchWards, form]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleWardChange = useCallback(debounce(async (wardCode: string) => {
    setWardCode(wardCode);
  }, 300), []);

  const onSubmit = async (data: z.infer<typeof checkoutFormSchema>) => {
    const result = await execute({
      ...data,
      userId: user?.id,
      orderItems: getItemList(cart),
      customBracelets: customBracelets.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        string: item.string,
        charms: item.charms
      })),
      fee: shippingFee || 0,
      districtId: districtId,
      wardCode: wardCode,
      provinceId: 203,
    });

    if (result[0] && result[0].success) {
      setCheckoutPayload({
        ...data,
        orderItems: getItemList(cart),
        customBracelets: customBracelets.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          string: item.string,
          charms: item.charms
        })),
        fee: shippingFee || 0,
        provinceId: 203,
        districtId: districtId,
        wardCode: wardCode,
      });
      router.push(result[0].redirectUrl as string);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h2 className="text-3xl font-bold mb-8">Checkout</h2> */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data as z.infer<typeof checkoutFormSchema>))} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <InputFieldCustom
                    name="name"
                    label="Họ và tên"
                    placeholder="Nhập họ và tên"
                    form={form}
                  />
                  <InputFieldCustom
                    name="phone"
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    form={form}
                  />
                  <InputFieldCustom
                    name="email"
                    label="Email"
                    placeholder="Nhập email"
                    form={form}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Địa chỉ giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  <SelectFieldCustom
                    name="district"
                    label="Quận/Huyện"
                    options={districts.map((d) => ({
                      id: d.DistrictID.toString(),
                      name: d.DistrictName,
                    }))}
                    form={form}
                    onChange={(value) => handleDistrictChange(Number(value))}
                  />
                  <SelectFieldCustom
                    name="ward"
                    label="Phường/Xã"
                    options={wards.map((w) => ({
                      id: w.WardCode,
                      name: w.WardName,
                    }))}
                    form={form}
                    onChange={handleWardChange}
                  />
                  <InputFieldCustom
                    name="address"
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ"
                    form={form}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              setPaymentMethod(value);
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cod" />
                              </FormControl>
                              <FormLabel className="font-normal">Thanh toán khi nhận hàng</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="payos" />
                              </FormControl>
                              <FormLabel className="font-normal">Thanh toán qua PayOS</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isPending || isLoadingShippingFee}>
                {isPending ? "Đang xử lý..." : "Đặt hàng"}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.imgProducts[0].imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      width={100}
                      height={100}
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="text-sm font-medium">{vietnamCurrency(item.salePrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                {customBracelets.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <CustomBraceletImage
                      charms={item.charms}
                      stringType={item.string}
                    />
                    <div>
                      <p className="font-semibold">{item.string.material} - {item.string.color}</p>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="text-sm font-medium">{vietnamCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  {shippingFee > 0 && (
                    <div className="flex text-sm justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>{isLoadingShippingFee ? 'Đang tính...' : vietnamCurrency(shippingFee)}</span>
                    </div>
                  )}
                  <p className="flex justify-between"><span>Tổng cộng:</span> <span className="font-bold">{vietnamCurrency(calculateTotal(getItemList(cart), customBracelets) + (shippingFee || 0))}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;