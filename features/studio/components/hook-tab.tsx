import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { StepsFormData } from "../studio";
import { useParams, useRouter } from "next/navigation";
import { getVideo } from "@/server/queries/video";
import { toast } from "sonner";
import { useVideoMutation } from "@/lib/hook/mutations/use-video-mutation";
import { getInitialMessagesFromTab } from "./studio-chat";

export function HookTab() {
  const router = useRouter();
  const params = useParams<{ videoId: string }>();

  const { register, watch, setValue, getValues } =
    useFormContext<StepsFormData>();

  const { append, setMessages } = useChat({
    id: "script",
    api: "/api/script/chat",
    body: {
      data: getValues(),
    },
  });
  ``;
  const { mutateAsync } = useVideoMutation();

  const [isEditing, setIsEditing] = useState(() =>
    !watch("hook") ? true : false,
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
      if (video.hook === watch("hook")) {
        setValue("selectedTab", "script");

        return;
      }
      await mutateAsync({
        videoId: params.videoId,
        data: {
          hook: watch("hook"),
        },
      });
      toast.success("Hook updated successfully!");
      setValue("selectedTab", "script");
      setMessages(getInitialMessagesFromTab("script"));
      await append({
        id: "2",
        content: "Generate a first script draft with the given info.",
        role: "user",
      });
    } catch {
      toast.error("Failed to update Hook");
    }
  }

  return (
    <div className="h-full rounded-xl bg-secondary p-4 text-secondary-foreground/70">
      <h1 className="font-semibold">Let’s create a catchy hook!</h1>
      {isEditing ? (
        <Textarea
          className="mt-4 rounded-xl border-white/40 bg-transparent"
          placeholder="Write your catchy hook or use a generated one"
          {...register("hook")}
        />
      ) : (
        <div className="mt-4">{watch("hook")}</div>
      )}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleEditing}
          disabled={!watch("hook")}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
        <Button
          size="sm"
          variant="default"
          disabled={!watch("hook")}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
