"use client";

import { LoaderButton } from "@/components/loader-button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useContext, useState } from "react";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { createCharmAction } from "./action";
import { ImageUploader } from "@/util/image-upload";
import { revalidatePath } from "next/cache";
import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from "@/app-config";
import { ToggleContext } from "@/components/interactive-overlay";
import { Terminal } from "lucide-react";


const createCharmSchema = z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    stock: z.number().min(0),
    file: z
        .instanceof(File)
        .refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
            message: `Your image was too large. It must be under ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
        })
});
export default function CreateCharmForm({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
    const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
    const { toast } = useToast();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { execute, error, isPending } = useServerAction(createCharmAction, {
        onSuccess: () => {
            toast({
                title: "Charm created",
                description: "Charm created successfully",
                variant: "success",
            });
            setIsOverlayOpen(false);
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Charm creation failed",
                variant: "error",
            });
        }
    });

    const form = useForm<z.infer<typeof createCharmSchema>>({
        resolver: zodResolver(createCharmSchema),
        defaultValues: {
            name: "",
            price: 0,
            stock: 0,
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof createCharmSchema>> = (values) => {
        const formData = new FormData();
        formData.append('file', values.file);

        execute({
            name: values.name,
            price: values.price,
            stock: values.stock,
            fileWrapper: formData,
        });
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    step="1"
                                    min="0"
                                    onKeyDown={(e) => {
                                        if (e.key === '.' || e.key === 'e' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value, 10);
                                        field.onChange(isNaN(value) ? 0 : value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    step="1"
                                    min="0"
                                    onKeyDown={(e) => {
                                        if (e.key === '.' || e.key === 'e' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value, 10);
                                        field.onChange(isNaN(value) ? 0 : value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input
                                    {...fieldProps}
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.target.files && event.target.files[0];
                                        onChange(file);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error creating event</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}
                <LoaderButton isLoading={isPending}>Create Charm</LoaderButton>
            </form>
        </Form>
    );
}