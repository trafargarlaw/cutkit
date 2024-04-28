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

export function SubjectTab() {
  const router = useRouter();
  const params = useParams<{ videoId: string }>();
  const { register, watch, setValue, getValues } =
    useFormContext<StepsFormData>();
  const { append, setMessages } = useChat({
    id: "story",
    api: "/api/story/chat",
    body: {
      data: getValues(),
    },
  });
  const { mutateAsync } = useVideoMutation();

  const [isEditing, setIsEditing] = useState(() =>
    !watch("subject") ? true : false,
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
      if (video.subject === watch("subject")) {
        setValue("selectedTab", "story");
        return;
      }
      await mutateAsync({
        videoId: params.videoId,
        data: {
          subject: watch("subject"),
        },
      });
      toast.success("Subject updated successfully!");
      setValue("selectedTab", "story");
      setMessages(getInitialMessagesFromTab("story"));
      await append({
        id: "2",
        content: "Generate a first story draft with our chosen subject.",
        role: "user",
      });
    } catch {
      toast.error("Failed to update subject");
    }
  }

  return (
    <div className="h-full rounded-xl bg-secondary p-4 text-secondary-foreground/70">
      <h1 className="font-semibold">What&apos;s your video about?</h1>
      {isEditing ? (
        <Textarea
          className="mt-4 rounded-xl border-white/40 bg-transparent"
          placeholder="describe what's your video about. You can discuss the subject with AI to have the best formulation of it."
          {...register("subject")}
        />
      ) : (
        <div className="mt-4">{watch("subject")}</div>
      )}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleEditing}
          disabled={!watch("subject")}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
        <Button
          size="sm"
          variant="default"
          disabled={!watch("subject")}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
