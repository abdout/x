// File: components/x/forms/PostThread.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

interface Props {
  userId: string; // ID of the user creating the thread
}

function PostThread({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Form setup with validation schema
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "", // Default value for thread content
      accountId: userId, // Store the user's ID as the accountId
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread, // Content of the thread
      author: userId, // Author of the thread (current user)
      communityId: null, // If you have a community feature, replace this logic
      path: pathname, // Path to revalidate after posting
    });

    // Redirect to homepage after successful post
    router.push("/");
  };

  return (
    <Form {...form}>
      <form className="mt-10 flex flex-col justify-start gap-10" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Thread content input */}
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">Content</FormLabel>
              <FormControl>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
