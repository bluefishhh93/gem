"use client";

import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/components/ui/use-toast";
import { Terminal, Upload } from "lucide-react";
import { updateProductAction } from "./action";
import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from "@/app-config";
import { Product } from "@/db/schema";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import NumberInput from "@/components/number-input";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleContext } from "@/components/interactive-overlay";
import { useCategories } from "@/hooks/use-category";

const editProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.number().positive("Category is required"),
  files: z.array(z.instanceof(File))
    .refine((files) => files.length === 0 || files.every(file => file.size < MAX_UPLOAD_IMAGE_SIZE), {
      message: `Each image must be under ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
    })
    .optional()
});

export function EditProductForm({ product, setIsOpen }: { product: Product; setIsOpen: (open: boolean) => void }) {
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const { categories, isLoading } = useCategories();

  const { execute, error, isPending } = useServerAction(updateProductAction, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product updated successfully",
        variant: "success",
      });
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  });

  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      stock: product.currentQuantity,
      description: product.description,
      categoryId: product.categoryId,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof editProductSchema>> = (values) => {
    const formData = new FormData();
    if (values.files) {
      values.files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    }

    execute({
      productId: product.id,
      name: values.name,
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description,
      categoryId: Number(values.categoryId),
      fileWrapper: formData,
    });
  };

  return (
    <div className="w-[300px]">
      <h2 className="text-lg text-center font-semibold mb-4">Edit Product</h2>
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
                <FormLabel>Images (Optional)</FormLabel>
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
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}