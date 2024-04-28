import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVideoMutation } from "@/lib/hook/mutations/use-video-mutation";
import { getVideo } from "@/server/queries/video";
import { useChat } from "ai/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { StepsFormData } from "../studio";
import { getInitialMessagesFromTab } from "./studio-chat";

export function StoryTab() {
  const router = useRouter();
  const params = useParams<{ videoId: string }>();

  const { register, watch, setValue, getValues } =
    useFormContext<StepsFormData>();

  const { append, setMessages } = useChat({
    id: "hook",
    api: "/api/hook/chat",
    body: {
      data: getValues(),
    },
  });

  const { mutateAsync } = useVideoMutation();

  const [isEditing, setIsEditing] = useState(() =>
    !watch("story") ? true : false,
  );

  function toggleEditing() {
    setIsEditing((prev) => !prev);
  }

  async function handleConfirm() {
    const video = await getVideo(params.videoId);

    if (!video) {
      toast.error("Video not found");
      router.push("/studio");
      return;
    }

    try {
      if (video.story === watch("story")) {
        setValue("selectedTab", "hook");

        return;
      }
      await mutateAsync({
        videoId: params.videoId,
        data: {
          story: watch("story"),
        },
      });
      toast.success("Story updated successfully!");
      setValue("selectedTab", "hook");
      setMessages(getInitialMessagesFromTab("hook"));
      await append({
        id: "2",
        content:
          "Generate a first set of hooks to make the viewer stop scrolling.",
        role: "user",
      });
    } catch {
      toast.error("Failed to update Story");
    }
  }

  return (
    <div className="h-full rounded-xl bg-secondary p-4 text-secondary-foreground/70">
      <h1 className="font-semibold">Now let’s work on the story!</h1>
      {isEditing ? (
        <Textarea
          className="mt-4 rounded-xl border-white/40 bg-transparent"
          placeholder="Write your video’s story or ask the Ai to help you make one."
          {...register("story")}
        />
      ) : (
        <div className="mt-4">{watch("story")}</div>
      )}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleEditing}
          disabled={!watch("story")}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
        <Button
          size="sm"
          variant="default"
          disabled={!watch("story") || !watch("subject")}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
