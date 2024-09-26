'use client';
import React, { useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { checkoutWithCOD, checkoutWithVNPay } from "../actions";
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

const checkoutFormSchema = z.object({
  name: z.string().trim().min(1, "Tên không được để trống"),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^\d{10}$/, "Số điện thoại không hợp lệ"),
  address: z.string().trim().min(1, "Địa chỉ không hợp lệ"),
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  paymentMethod: z.enum(["cod", "vnpay"], {
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

  const { cart, customBracelets, clearCart, setCheckoutPayload } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const getItemList = useCallback((cart: ProductType[]): CartItemType[] => {
    return cart.map((item: ProductType) => ({
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
    paymentMethod === "cod" ? checkoutWithCOD : checkoutWithVNPay,
    {
      onSuccess: () => {      
          // clearCart();
      },
      onError: ({err}) => {
        toast({
          variant: "error",
          title: 'Đặt hàng thất bại',
          description: `Có lỗi xảy ra, vui lòng thử lại sau, ${err.message || ''}`,
        });
      }
    }
  );

  const handleDistrictChange = (districtId: string) => {
    fetchWards(districtId);
    form.setValue("ward", "");
  };

  const onSubmit = async (data: z.infer<typeof checkoutFormSchema>) => {
    console.log(customBracelets, 'customBracelets')
    const result = await execute({
      ...data,
      userId: user?.id,
      orderItems: getItemList(cart),
      customBracelets: customBracelets.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        stringType: item.stringType,
        charms: item.charms
      }))
    });

    if(result[0] && result[0].success) {
      setCheckoutPayload({
        ...data,
        orderItems: getItemList(cart),
        customBracelets: customBracelets.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          stringType: item.stringType,
          charms: item.charms
        }))
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
                      id: d.district_id,
                      name: d.district_name,
                    }))}
                    form={form}
                    onChange={handleDistrictChange}
                  />
                  <SelectFieldCustom
                    name="ward"
                    label="Phường/Xã"
                    options={wards.map((w) => ({ id: w.ward_id, name: w.ward_name }))}
                    form={form}
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
                                <RadioGroupItem value="vnpay" />
                              </FormControl>
                              <FormLabel className="font-normal">Thanh toán qua VNPay</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isPending}>
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
                      stringType={item.stringType}
                    />
                    <div>
                      <p className="font-semibold">{item.stringType.material} - {item.stringType.color}</p>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="text-sm font-medium">{vietnamCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <p className="flex justify-between"><span>Tổng cộng:</span> <span className="font-bold">{vietnamCurrency(calculateTotal(getItemList(cart), customBracelets))}</span></p>
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