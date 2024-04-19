import { Button } from "@/components/ui/button";
import LoadingDots from "@/components/ui/loading-dots";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useVideoMutation } from "@/lib/hook/mutations/use-video-mutation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useChat } from "ai/react";
import Image from "next/image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { StepsFormData } from "../studio";
import { AudioPreview } from "./audio-preview";
import { useUploadThing } from "@/lib/hook/use-uploadthing";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export function ScriptTab() {
  const { register, watch, setValue, getValues } =
    useFormContext<StepsFormData>();

  const params = useParams<{ videoId: string }>();

  const { data: voices } = useQuery<{
    voices: Voice[];
  }>({
    queryKey: ["voices"],
    queryFn: () =>
      fetch("https://api.elevenlabs.io/v1/voices").then((res) => res.json()),
  });

  const { startUpload, permittedFileInfo } = useUploadThing("audioUploader");

  const {
    data: generatedAudio,
    mutateAsync,
    isPending: isAudioGenerationPending,
  } = useMutation({
    mutationKey: ["speech"],
    mutationFn: ({ text, voice }: { text: string; voice: string }) =>
      fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice,
        }),
      }).then(async (res) => await res.blob()),
    onSuccess: async (data) => {
      const file = new File([data], `${watch("title")}.mp3`, {
        type: "audio/mp3",
      });
      console.log("salut a tous c'est asfax?");

      const result = await startUpload([file], {
        videoId: params.videoId,
        voice: watch("script.voice"),
      });

      console.log(result);
    },
  });

  const { mutateAsync: mutateVideoAsync } = useVideoMutation();

  const { append, setMessages } = useChat({
    id: "script",
    api: "/api/script/chat",
    body: {
      data: getValues("script.text"),
    },
  });

  const [isEditing, setIsEditing] = useState(() =>
    !watch("script.text") ? true : false,
  );

  function toggleEditing() {
    setIsEditing((prev) => !prev);
  }

  async function handleGenerateAudio() {
    if (!watch("script.text") || !watch("script.voice")) {
      return;
    }
    try {
      await mutateVideoAsync({
        videoId: params.videoId,
        data: {
          script: watch("script.text"),
        },
      });
      await mutateAsync({
        text: watch("script.text"),
        voice: watch("script.voice"),
      });
    } catch {
      toast.error("Failed to update Hook");
    }
  }

  async function handleConfirm() {
    setValue("selectedTab", "images");
  }
  return (
    <div className="grid gap-4">
      <div className="h-full rounded-xl bg-secondary p-4 text-secondary-foreground/70">
        <h1 className="font-semibold">
          Let’s generate the script and listen to it!
        </h1>
        {isEditing ? (
          <Textarea
            className="mt-4 rounded-xl border-white/40 bg-transparent"
            placeholder="Write your catchy hook or use a generated one"
            {...register("script.text")}
          />
        ) : (
          <div className="mt-4">{watch("script.text")}</div>
        )}

        <div className="mt-4 flex items-center justify-between gap-x-2">
          <span className="font-bold">Voice over</span>

          <Select
            value={watch("script.voice")}
            onValueChange={(value) => setValue("script.voice", value)}
          >
            <SelectTrigger className="w-44 rounded-full">
              <SelectValue placeholder="Choose voice" />
            </SelectTrigger>
            <SelectContent className="max-h-96 w-60 overflow-y-auto rounded-lg border-white/50 bg-secondary text-secondary-foreground ">
              {voices?.voices.map((voice) => (
                <SelectItem
                  value={voice.voice_id}
                  key={voice.voice_id}
                  className="group"
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <AudioPreview voice={voice} />
                      <Image
                        src={`https://avatar.vercel.sh/${voice.name}`}
                        className="rounded-full group-hover:hidden group-focus:hidden"
                        alt={voice.name}
                        width={24}
                        height={24}
                      />
                    </div>
                    <span>{voice.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={toggleEditing}
            disabled={!watch("script")}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button
            size="sm"
            variant="default"
            disabled={!watch("script") || isAudioGenerationPending}
            onClick={handleGenerateAudio}
            className="gap-2"
          >
            Generate Audio
            {isAudioGenerationPending && <LoadingDots />}
          </Button>
        </div>
      </div>
      {generatedAudio ? (
        <div className="rounded-xl bg-secondary p-4 text-secondary-foreground/80">
          <div>
            <audio
              className="w-full"
              controls
              src={URL.createObjectURL(generatedAudio)}
            />
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="default"
              disabled={!watch("script")}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <>
          {watch("audioUrl") && (
            <div className="rounded-xl bg-secondary p-4 text-secondary-foreground/80">
              <div>
                <audio className="w-full" controls src={watch("audioUrl")} />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="default"
                  disabled={!watch("script")}
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
