"use client";

import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/components/ui/use-toast";
import { Terminal, Upload } from "lucide-react";
import { createProductAction } from "./action";
import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from "@/app-config";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import NumberInput from "@/components/number-input";
import Image from "next/image";
import { ToggleContext } from "@/components/interactive-overlay";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCategories } from "@/hooks/use-category";

const createProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0, "Price must be a positive number"),
    stock: z.number().int().min(0, "Stock must be a non-negative integer"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.number().min(1, "Category is required"),
    files: z.array(z.instanceof(File))
        .refine((files) => files.length > 0, "At least one image is required")
        .refine((files) => files.every(file => file.size < MAX_UPLOAD_IMAGE_SIZE), {
            message: `Each image must be under ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
        })
});

export default function CreateProductForm({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
    const { toast } = useToast();
    const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const { categories, isLoading } = useCategories();

    const { execute, error, isPending } = useServerAction(createProductAction, {
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Product created successfully",
                variant: "success",
            });
            setIsOverlayOpen(false);
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create product",
                variant: "destructive",
            });
        }
    });

    const form = useForm<z.infer<typeof createProductSchema>>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            price: 0,
            stock: 0,
            description: "",
            categoryId: 0,
            files: []
        }
    })

    const onSubmit: SubmitHandler<z.infer<typeof createProductSchema>> = (values) => {
        const formData = new FormData();
        values.files.forEach((file, index) => {
            formData.append("files", file, file.name);
        })

        execute({
            name: values.name,
            description: values.description,
            price: values.price,
            categoryId: values.categoryId,
            stock: values.stock,
            fileWrapper: formData
        })
    }

    return (
        <div className="w-[300px]">
            <h2 className="text-lg text-center font-semibold mb-4">Create New Product</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex space-x-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            isInteger={false}
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            placeholder="0.00"
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
                                <FormItem className="flex-1">
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            isInteger={true}
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                            placeholder="0"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter description" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category ID</FormLabel>
                                <FormControl>
                                    <NumberInput
                                        isInteger={true}
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                        placeholder="Enter category ID"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                    <Separator />
                    <FormField
                        control={form.control}
                        name="files"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            field.onChange(files);
                                            setImagePreview(files.map(file => URL.createObjectURL(file)));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                                {imagePreview.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {imagePreview.map((src, index) => (
                                            <Image key={index} src={src} alt={`Preview ${index + 1}`} width={50} height={50} className="object-cover rounded" />
                                        ))}
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />
                    {error && (
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Upload className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Product"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

