import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/components/ui/use-toast";
import { Terminal, Upload } from "lucide-react";
import { updateStringAction } from "./action";
import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from "@/app-config";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import NumberInput from "@/components/number-input";
import Image from "next/image";
import { String } from "@/db/schema";

const updateStringSchema = z.object({
  color: z.string().min(1, "Color is required"),
  material: z.string().min(1, "Material is required"),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  file: z
    .instanceof(File)
    .refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
      message: `Image must be under ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
    })
    .optional(),
});

export function EditStringForm({ string, setIsOpen }: { string: String; setIsOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(string.imageUrl);

  const { execute, error, isPending } = useServerAction(updateStringAction, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "String updated successfully",
        variant: "success",
      });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update string",
        variant: "destructive",
      });
    }
  });

  const form = useForm<z.infer<typeof updateStringSchema>>({
    resolver: zodResolver(updateStringSchema),
    defaultValues: {
      color: string.color,
      material: string.material,
      price: string.price,
      stock: string.stock,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof updateStringSchema>> = (values) => {
    const formData = new FormData();
    if (values.file) {
      formData.append('file', values.file);
    }

    execute({
      id: string.id,
      color: values.color,
      material: values.material,
      price: Number(values.price),
      stock: Number(values.stock),
      fileWrapper: values.file ? formData : undefined,
    });
  };

  return (
    <div className="w-[300px]">
      <h2 className="text-lg text-center font-semibold mb-4">Edit String</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter color" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter material" />
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
          <Separator />
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files && event.target.files[0];
                        if (file) {
                          onChange(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </label>
                    {imagePreview && (
                      <Image src={imagePreview} alt="String preview" width={50} height={50} className="rounded-full object-cover" />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error updating string</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}