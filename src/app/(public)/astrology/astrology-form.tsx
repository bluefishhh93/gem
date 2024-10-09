'use client'

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader2, MoonIcon, Sparkles, SunIcon } from "lucide-react";

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
import { Calendar, Clock, Moon, User } from "lucide-react";
import { ProductType } from "@/hooks/use-cart-store";
import StarryBackground from "@/components/starry-background";


const keyTranslations = {
    health: "Sức khỏe",
    family: "Gia đình",
    love: "Tình yêu",
    career: "Sự nghiệp",
    business: "Kinh doanh",
    finance: "Tài chính",
    relationships: "Các mối quan hệ",
    luck: "May mắn"
};


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
    description: string;
}

interface filteredProduct {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
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


export default function AstrologyForm({ products }: { products: filteredProduct[] }) {
    const { execute, isPending, error } = useServerAction(getAstrologyPredictionAction);
    const [result, setResult] = useState<AstrologyPrediction | null>(null);
    const [activeStep, setActiveStep] = useState(1);

    const form = useForm<AstrologyFormValues>({
        resolver: zodResolver(astrologySchema),
        defaultValues: {
            name: "",
            birthday: {
                day: new Date().getDate(),
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                calendar: "solar",
            },
            birthTime: {
                hour: 12,
                minute: 0,
            },
            gender: "male",
            viewMonth: getLunarDate(new Date()).getMonth(),
            viewYear: getLunarDate(new Date()).getYear(),
        },
    });

    const onSubmit: SubmitHandler<AstrologyFormValues> = async (values) => {
        if (activeStep !== 4) return; // Only submit if on the last step
        try {
            const response = await execute({ ...values, products });
            if (response && response[0]) {
                setResult(response[0].result);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            // Handle the error and set the active step to the tab with the error
            console.error("Error submitting form:", error);
            const errorStep = getErrorStep(error);
            setActiveStep(errorStep);
        }
    };

    const getErrorStep = (error: any): number => {
        if (error.message.includes("name") || error.message.includes("gender")) return 1;
        if (error.message.includes("birthday")) return 2;
        if (error.message.includes("birthTime")) return 3;
        if (error.message.includes("viewMonth") || error.message.includes("viewYear")) return 4;
        return 4;
    }

    const steps = [
        { title: "Thông tin cá nhân", icon: User },
        { title: "Ngày sinh", icon: Calendar },
        { title: "Giờ sinh", icon: Clock },
        { title: "Thời gian xem", icon: Moon },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br relative overflow-hidden">
            {/* <StarryBackground /> */}
            {/* Enhanced animated stars background */}
            {/* <div className="absolute inset-0 overflow-hidden">
                <div className="stars-container absolute inset-0">
                    {[...Array(100)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            initial={{ opacity: 0.1 + Math.random() * 0.5 }}
                            animate={{
                                opacity: [0.1 + Math.random() * 0.5, 0.8, 0.1 + Math.random() * 0.5],
                                scale: [1, 1.2, 1],
                                rotate: [0, 360]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 5,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>
            </div> */}
            <div className="container mx-auto px-4 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block mb-6"
                        >
                            <Sparkles className="w-16 h-16 text-purple-300" />
                        </motion.div>
                        <h1 className={`${playfairDisplay.className} text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-200 mb-4`}>
                            Xem Tử Vi
                        </h1>
                        <p className="text-purple-200 text-lg">
                            Khám phá vận mệnh và những dự đoán cho tương lai của bạn
                        </p>
                    </div>

                    <Card className="backdrop-blur-md bg-white/10 shadow-2xl border border-purple-500/20">
                        <CardHeader>
                            <div className="flex justify-between items-center mb-6">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        className={`flex flex-col items-center ${activeStep === index + 1
                                            ? 'text-purple-300'
                                            : 'text-gray-400'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep === index + 1
                                            ? 'bg-purple-900/50 border-2 border-purple-400'
                                            : 'bg-gray-800/50 border border-gray-600'
                                            }`}>
                                            <step.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm hidden md:block">{step.title}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Step 1: Personal Information */}
                                    <div className={activeStep === 1 ? 'block' : 'hidden'}>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-lg dark:text-gray-200">Họ và tên</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="bg-purple-900/30 border-purple-500/30 text-purple-100 placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem className="mt-6">
                                                    <FormLabel className="text-lg dark:text-gray-200">Giới tính</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex gap-4"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="male" id="male" />
                                                                <label htmlFor="male" className="cursor-pointer dark:text-gray-200">Nam</label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="female" id="female" />
                                                                <label htmlFor="female" className="cursor-pointer dark:text-gray-200">Nữ</label>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Steps 2-4: Apply similar dark mode classes */}
                                    {/* ... */}
                                    <div className={activeStep === 2 ? 'block' : 'hidden'}>
                                        <div className="grid grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="birthday.day"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-lg">Ngày</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Ngày"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                className="bg-purple-900/30 border-purple-500/30 text-purple-100 placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
                                                                />
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
                                                        <FormLabel className="text-lg">Tháng</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Tháng"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                className="bg-purple-900/30 border-purple-500/30 text-purple-100 placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
                                                                />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="birthday.year"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-lg">Năm</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Năm"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                className="bg-purple-900/30 border-purple-500/30 text-purple-100 placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
                                                                />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="birthday.calendar"
                                            render={({ field }) => (
                                                <FormItem className="mt-6">
                                                    <FormLabel className="text-lg">Loại lịch</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col gap-4"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="solar" id="solar" />
                                                                <label htmlFor="solar" className="cursor-pointer flex gap-2 items-center space-x-2">
                                                                    <SunIcon className="h-5 w-5 text-yellow-400" />
                                                                    Dương lịch
                                                                </label>
                                                            </div>
                                                            <div className="flex  items-center space-x-2">
                                                                <RadioGroupItem value="lunar" id="lunar" />
                                                                <label htmlFor="lunar" className="cursor-pointer flex gap-2 items-center space-x-2">
                                                                    <MoonIcon className="h-5 w-5 text-purple-300" />
                                                                    Âm lịch
                                                                </label>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Step 3: Birth Time */}
                                    <div className={activeStep === 3 ? 'block' : 'hidden'}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="birthTime.hour"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-lg">Giờ</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Giờ"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                className="bg-purple-900/30 border-purple-500/30 text-purple-100 placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
                                                                />
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
                                                        <FormLabel className="text-lg">Phút</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Phút"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                className="bg-purple-900/30 border-purple-500/30 text-purple-100 placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
                                                                />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Step 4: View Time */}
                                    <div className={activeStep === 4 ? 'block' : 'hidden'}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="viewMonth"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-lg">Tháng xem (Âm lịch)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Tháng xem"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                className="bg-purple-900/30 border-purple-500/30 text-purple-100 placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
                                                                />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>)}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="viewYear"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-lg">Năm xem</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Năm xem"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                className="bg-purple-900/30 border-purple-500/30 text-purple-100 placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
                                                                />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-8">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                                            disabled={activeStep === 1}
                                            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/50
                                            transition-all duration-300"                                        >
                                            Quay lại
                                        </Button>
                                        {activeStep < 4 && (
                                            <Button
                                                type="button"
                                                onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
                                                className="dark:bg-secondary-600 dark:text-white"
                                            >
                                                Tiếp tục
                                            </Button>
                                        )}
                                        {
                                            activeStep === 4 && (
                                                (
                                                    <Button type="submit" disabled={isPending} className="dark:bg-secondary-600 dark:text-white">
                                                        {isPending ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Đang xử lý...
                                                            </>
                                                        ) : (
                                                            "Xem tử vi"
                                                        )}
                                                    </Button>
                                                )
                                            )
                                        }
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>

                {result && <AstrologyResult result={result} />}
            </div>
        </div>
    );
}

const AstrologyResult = ({ result }: { result: AstrologyPrediction }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 max-w-6xl mx-auto"
        >
            <h2 className={`${playfairDisplay.className} text-4xl font-bold text-secondary-900 dark:text-secondary-100 text-center mb-12`}>
                Kết Quả Tử Vi Của Bạn
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(result).map(([key, value]) => {
                    if (key !== 'recommendedProducts' && key !== 'zodiacProduct' && typeof value === 'string') {
                        return (
                            <motion.div
                                key={key}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow dark:bg-gray-800">
                                    <CardHeader className="bg-gradient-to-r from-secondary-300 to-indigo-300 dark:from-secondary-700 dark:to-indigo-700 text-white">
                                        <CardTitle className="capitalize">{keyTranslations[key as keyof typeof keyTranslations] || key}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{value}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    }
                    return null;
                })}
            </div>

            <div className="mt-16">
                <h2 className={`${playfairDisplay.className} text-4xl font-bold text-secondary-600 dark:text-secondary-400 text-center mb-12`}>
                    Sản Phẩm Phong Thủy Gợi Ý
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[...result.recommendedProducts, ...(result.zodiacProduct ? [result.zodiacProduct] : [])].map((product, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out dark:bg-gray-700">
                                <div className="relative h-64">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold mb-3 dark:text-white">{product.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">{product.reason}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-secondary-300">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(product.price)}
                                        </span>
                                        <Link href={`/products/${product.id}`}>
                                            <Button className="bg-secondary-300 hover:bg-secondary-400 text-white">
                                                Xem chi tiết
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};