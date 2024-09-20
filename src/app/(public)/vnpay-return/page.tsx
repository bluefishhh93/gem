
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/hooks/use-cart-store';
import { finalizeVNPayPaymentAction } from '../checkout/actions';
import { useServerAction } from 'zsa-react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function VNPayReturnPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkoutPayload, clearCart } = useCartStore();
    const { execute, error, isPending } = useServerAction(finalizeVNPayPaymentAction, {
        onError: ({ err }) => {
            router.push('/checkout/failed');
        }
    })

    useEffect(() => {
        if (checkoutPayload && searchParams) {
            const finalizePayment = async () => {
                try {
                    const [result] = await execute({
                        queryString: searchParams.toString(),
                        checkoutData: checkoutPayload
                    });
                    if (result && result.success) {
                        router.push(`/checkout/success?orderId=${result.orderId}`);
                    }
                } catch (err) {
                    console.error('Error finalizing payment:', err);
                }
            };

            finalizePayment();
        }
    }, [checkoutPayload, searchParams, execute]);

    if (isPending) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-screen bg-background"
            >
                <Card className="w-full max-w-md border-secondary">
                    <CardHeader>
                        <CardTitle className="text-center text-secondary-400 text-2xl font-bold">Xử lý thanh toán</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <Loader2 className="h-16 w-16 animate-spin text-secondary" />
                        <p className="mt-4 text-center text-muted-foreground">
                            Vui lòng chờ trong giây lát...
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
            >
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-gray-600 dark:text-gray-400">
                            {error.message || "An error occurred while processing your payment."}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return null;
}