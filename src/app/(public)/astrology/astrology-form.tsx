'use client'

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { getLunarDate } from "@/util/date";
import { getAstrologyPredictionAction } from "./actions";
import { playfairDisplay } from "@/util/fonts";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

// Define types for the API response
interface AstrologyPrediction {
    health: string;
    family: string;
    love: string;
    career: string;
    business: string;
    finance: string;
    relationships: string;
    luck: string;
    recommendedProducts: RecommendedProduct[];
    zodiacProduct?: RecommendedProduct;
}

interface RecommendedProduct {
    id: number;
    reason: string;
    name: string;
    price: number;
    imageUrl: string;
}

const astrologySchema = z.object({
    name: z.string().min(1, "Tên không được để trống"),
    birthday: z.object({
        day: z.number().min(1).max(31),
        month: z.number().min(1).max(12),
        year: z.number().min(1900).max(new Date().getFullYear()),
        calendar: z.enum(["lunar", "solar"]),
    }),
    birthTime: z.object({
        hour: z.number().min(0).max(23),
        minute: z.number().min(0).max(59),
    }),
    gender: z.enum(["male", "female"]),
    viewMonth: z.number().min(1).max(12),
    viewYear: z.number().min(1900).max(new Date().getFullYear()),
});

type AstrologyFormValues = z.infer<typeof astrologySchema>;

export default function AstrologyForm() {
    const { execute, isPending, error } = useServerAction(getAstrologyPredictionAction);
    const [result, setResult] = useState<AstrologyPrediction | null>(null);

    const form = useForm<AstrologyFormValues>({
        resolver: zodResolver(astrologySchema),
        defaultValues: {
            name: "",
            birthday: {
                day: 1,
                month: 1,
                year: 1900,
                calendar: "lunar",
            },
            birthTime: {
                hour: 12,
                minute: 30,
            },
            gender: "male",
            viewMonth: getLunarDate(new Date()).getMonth(),
            viewYear: new Date().getFullYear(),
        },
    });

    const onSubmit: SubmitHandler<AstrologyFormValues> = async (values) => {
        const response = await execute(values);
        if (response && response[0]) {
            setResult(response[0].result);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className={`${playfairDisplay.className} text-4xl font-bold tracking-tighter md:text-5xl/tight text-center mb-8`}>
                    Xem Tử Vi
                </h1>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Nhập thông tin của bạn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Họ và tên</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập họ và tên" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="birthday.day"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày sinh</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Ngày" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="birthday.month"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tháng sinh</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Tháng" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="birthday.year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Năm sinh</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Năm" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="birthday.calendar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loại lịch</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="solar" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Dương lịch
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="lunar" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Âm lịch
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="birthTime.hour"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giờ sinh</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Giờ" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="birthTime.minute"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phút sinh</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Phút" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giới tính</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="male" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Nam
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="female" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Nữ
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="viewMonth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tháng xem</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Tháng xem" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="viewYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Năm xem</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Năm xem" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        "Xem tử vi"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-12"
                >
                    <h2 className={`${playfairDisplay.className} text-3xl font-bold tracking-tighter md:text-4xl/tight text-center mb-8`}>
                        Kết quả xem tử vi của bạn
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(result).map(([key, value]) => {
                            if (key !== 'recommendedProducts' && key !== 'zodiacProduct' && typeof value === 'string') {
                                return (
                                    <Card key={key} className="overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-primary to-secondary">
                                            <CardTitle className="text-white capitalize">{key}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <p>{value}</p>
                                        </CardContent>
                                    </Card>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <h2 className={`${playfairDisplay.className} text-3xl font-bold tracking-tighter md:text-4xl/tight text-center my-8`}>
                        Sản phẩm gợi ý cho bạn
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...result.recommendedProducts, ...(result.zodiacProduct ? [result.zodiacProduct] : [])].map((product, index) => (
                            <Card key={index} className="overflow-hidden">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    className="w-full h-48 object-cover"
                                />
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-2">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{product.reason}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(product.price)}
                                        </span>
                                        <Link href={`/products/${product.id}`}>
                                            <Button>Xem chi tiết</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}