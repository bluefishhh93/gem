"use client";

import React, { useState, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/components/ui/use-toast";
import { FilePlus, LoaderCircle, Terminal, Upload } from "lucide-react";
import { createBlogAction } from "./action";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { ToggleContext } from "@/components/interactive-overlay";

const MAX_UPLOAD_IMAGE_SIZE = 5000000; // 5MB
const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5;

const createDraftSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.instanceof(File).refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
    message: `Image must be under ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
  }),
  content: z.string(),
});

export default function CreateBlogButton() {
  const router = useRouter();
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { execute, error, isPending } = useServerAction(createBlogAction, {
    onSuccess: (draft) => {
      toast({
        title: "Success",
        description: "Draft created successfully",
        variant: "success",
      });
      setIsOpen(false);
      setIsOverlayOpen(false);
      router.push(`/admin-blogs/${draft.data.id}`);
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create draft",
        variant: "destructive",
      });
    }
  });

  const form = useForm<z.infer<typeof createDraftSchema>>({
    resolver: zodResolver(createDraftSchema),
    defaultValues: {
      title: "",
      image: undefined,
      content: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof createDraftSchema>> = (values) => {
    const formData = new FormData();
    formData.append('file', values.image);

    execute({
      title: values.title,
      content: "Nhập nội dung...",
      image: formData,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full font-medium text-primary items-center justify-center gap-2 p-3 hover:bg-secondary-200 hover:text-primary-foreground transition-colors duration-200 rounded-md"
        >
          <FilePlus size={18} />
          <span>New Draft</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Draft</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter draft title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        {...field}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Image
                      </label>
                      {imagePreview && (
                        <Image src={imagePreview} alt="Preview" width={50} height={50} className="rounded-full object-cover" />
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
                <AlertTitle>Error creating draft</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Draft"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}