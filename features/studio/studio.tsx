"use client";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { stepsValidationSchema } from "@/lib/validation/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { StudioTabs } from "./components";
import { StudioChat } from "./components/studio-chat";
import type { Video } from "@/server/db/schema";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateVideo } from "@/server/queries/video";
import { toast } from "sonner";

export type StepsFormData = z.infer<typeof stepsValidationSchema>;
export type StepsFormType = UseFormReturn<FormData>;

export function Studio({ video }: { video: Video }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const methods = useForm<StepsFormData>({
    resolver: zodResolver(stepsValidationSchema),
    defaultValues: {
      selectedTab: "subject",
      hook: video.hook ?? undefined,
      story: video.story ?? undefined,
      subject: video.subject ?? undefined,
      script: {
        text: video.script ?? undefined,
        voice: video.voice ?? undefined,
      },
      title: video.title ?? "Untitled",
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["updateVideo"],
    mutationFn: async ({
      videoId,
      data,
    }: {
      videoId: string;
      data: Partial<Video>;
    }) => await updateVideo(videoId, data),
  });

  async function handleTitleChange(e: React.FormEvent) {
    e.preventDefault();
    try {
      await mutateAsync({
        videoId: video.id,
        data: {
          title: methods.getValues("title"),
        },
      });
      toast.success("Title updated successfully!");
    } catch {
      toast.error("Failed to update title");
    } finally {
      setIsEditingTitle(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <main className="grid h-full grid-cols-2 gap-4 overflow-y-auto p-4">
        <div className="rounded-xl bg-white p-4">
          <div className="flex items-center gap-2 font-semibold">
            <Icons.squarePlay className="size-8 text-primary" />
            <div>
              {isEditingTitle ? (
                <form
                  className="flex items-center"
                  onSubmit={handleTitleChange}
                >
                  <input
                    type="text"
                    className="w-36 text-lg font-semibold text-gray-600 focus:outline-none"
                    {...methods.register("title")}
                    autoFocus
                  />
                  <button className="text-green-500" type="submit">
                    <Icons.check className="size-5" />
                  </button>
                </form>
              ) : (
                <div
                  className="cursor-pointer text-lg font-semibold "
                  onClick={() => setIsEditingTitle(true)}
                >
                  {methods.watch("title")}
                </div>
              )}
            </div>

            {!isEditingTitle && (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full bg-gray-100 p-1.5">
                  <Icons.ellipsis className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">
                    Delete video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="mt-4">
            <StudioTabs />
          </div>
        </div>
        <div className="overflow-y-auto rounded-xl bg-white p-4">
          <StudioChat />
        </div>
      </main>
    </FormProvider>
  );
}
