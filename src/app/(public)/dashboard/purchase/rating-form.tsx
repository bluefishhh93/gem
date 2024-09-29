import { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/components/ui/use-toast"
import { Loader2Icon, Terminal, Upload, XIcon, StarIcon, LoaderCircleIcon } from "lucide-react";
import { createReviewAction } from './actions'
import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from "@/app-config";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ToggleContext } from "@/components/dialog-overlay";


const createReviewSchema = z.object({
  comment: z.string().max(200, "Bình luận không được quá 200 ký tự").optional(),
  rating: z.number().min(1).max(5),
  images: z.array(z.instanceof(File)).max(3, "Chỉ được upload tối đa 3 ảnh")
    .refine((files) => files.every(file => file.size < MAX_UPLOAD_IMAGE_SIZE), {
      message: `Mỗi ảnh phải nhỏ hơn ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
    })
})

export function RatingForm({
  orderItemId,
  productId,
  setIsOpen
}: {
  orderItemId: number;
  productId: number;
  setIsOpen: (open: boolean) => void;
}) {
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const { execute, error, isPending } = useServerAction(createReviewAction, {
    onSuccess: () => {
      toast({
        title: "Thông báo",
        description: "Đánh giá đã được gửi thành công",
        variant: "success"
      })
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Có lỗi xảy ra",
        description: "Đánh giá không thành công",
        variant: "error"
      })
      setIsOverlayOpen(false);
    }
  })

  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      comment: "",
      rating: 5,
      images: []
    }
  })

  const onSubmit: SubmitHandler<z.infer<typeof createReviewSchema>> = (values) => {
    const formData = new FormData();
    values.images.forEach((image) => {
      formData.append("images", image);
    });

    execute({
      orderItemId,
      productId,
      rating: values.rating,
      comment: values.comment,
      formData
    })
  }

  const handleImageRemove = (index: number) => {
    const newImages = [...form.getValues().images];
    newImages.splice(index, 1);
    form.setValue("images", newImages);
    setImagePreview(prev => {
      const newPreview = [...prev];
      newPreview.splice(index, 1);
      return newPreview;
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bình luận</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Share your thoughts..."
                  className="resize-none h-32"
                  maxLength={200}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({field}) => (
            <FormItem>
              <FormLabel>Đánh giá</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      className={cn("text-2xl transition-colors", {
                        "text-yellow-400": star <= field.value,
                        "text-gray-300 hover:text-yellow-400": star > field.value,
                      })}
                    >
                     <StarIcon
                        className={cn("h-6 w-6", { "fill-current": star <= field.value })}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name = "images"
          render = {({field})=> (
            <FormItem>
              <FormLabel>Ảnh sản phẩm (Tối đa 3 ảnh)</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-4">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                      <Image
                        src={src}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 rounded-full bg-white/80 p-1 text-gray-600 transition-colors hover:bg-white hover:text-red-500"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                   {imagePreview.length < 3 && (
                    <label
                      htmlFor="image-upload"
                      className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:border-blue-500 hover:text-blue-500 cursor-pointer"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <span className="text-sm">Upload Image</span>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          field.onChange([...field.value, ...files]);
                          setImagePreview(prev => [
                            ...prev,
                            ...files.map(file => URL.createObjectURL(file))
                          ]);
                        }}
                        className="sr-only"
                      />
                    </label>
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
            <AlertTitle>Error submitting review</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </Form>
  );
}