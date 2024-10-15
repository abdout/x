"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isBase64Image } from "@/lib/utils";

import { UserValidation } from "@/lib/validations/user";
import { updateUser } from "@/lib/actions/user.actions";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  user: {
    id: string;
    objectId?: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo;

    // Process image change if it’s a new upload (base64 format)
    if (isBase64Image(blob)) {
      // Image upload logic here (if needed)
    }

    await updateUser({
      name: values.name,
      path: pathname,
      username: values.username,
      userId: user.id,
      bio: values.bio,
      image: values.profile_photo,
    });

    router.push(pathname === "/profile/edit" ? "/" : "/profile");
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles([file]);

      if (!file.type.includes("image")) return;

      fileReader.onload = (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-10" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
