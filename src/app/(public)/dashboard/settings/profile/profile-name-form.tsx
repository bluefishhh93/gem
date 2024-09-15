"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoaderButton } from "@/components/loader-button";
import { useToast } from "@/components/ui/use-toast";
import { updateProfileNameAction } from "./actions";

const updateProfileNameSchema = z.object({
  profileName: z.string().min(1),
});

export function ProfileNameForm({ profileName }: { profileName: string }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateProfileNameSchema>>({
    resolver: zodResolver(updateProfileNameSchema),
    defaultValues: {
      profileName: profileName,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof updateProfileNameSchema>> = (
    values,
    event
  ) => {
    startTransition(() => {
      updateProfileNameAction(values).then(() => {
        if (event) {
          const form = event.target as HTMLFormElement;
          form.reset();
        }
        toast({
          title: "Thành công",
          description: "Tên đã được cập nhật thành công.",
        });
      });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex gap-2 flex-1"
      >
        <FormField
          control={form.control}
          name="profileName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Tên hiển thị</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton isLoading={pending}>Lưu</LoaderButton>
      </form>
    </Form>
  );
}
