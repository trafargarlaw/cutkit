"use client";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useVideoMutation } from "@/lib/hook/mutations/use-video-mutation";
import { stepsValidationSchema } from "@/lib/validation/steps";
import type { Video } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { StudioTabs } from "./components";
import { StudioChat } from "./components/studio-chat";
import { cn } from "@/lib/utils";

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
        voice: video.audio?.voice ?? undefined,
      },
      title: video.title ?? "Untitled",
      audioUrl: video.audio?.url ?? undefined,
    },
  });

  const { mutateAsync } = useVideoMutation();

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
      <main
        className={cn(
          {
            "grid-cols-1": methods.watch("selectedTab") === "images",
            "grid-cols-2": methods.watch("selectedTab") !== "images",
          },
          "grid h-full gap-4 overflow-y-auto p-4",
        )}
      >
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
        {methods.watch("selectedTab") !== "images" && (
          <div className="overflow-y-auto rounded-xl bg-white p-4">
            <StudioChat />
          </div>
        )}
      </main>
    </FormProvider>
  );
}
