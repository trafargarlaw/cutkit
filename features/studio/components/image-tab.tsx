"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoadingDots from "@/components/ui/loading-dots";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateImage } from "@/lib/hook/mutations/use-generate-images";
import { getVideo } from "@/server/queries/video";
import type { InferResultType } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { StepsFormData } from "../studio";
import { useUploadThing } from "@/lib/hook/use-uploadthing";
import { UploadButton } from "@/lib/uploadthing";

export function ImagesTab() {
  const params = useParams<{ videoId: string }>();
  const { register, watch } = useFormContext<StepsFormData>();
  const queryClient = useQueryClient();

  const { data: video } = useQuery({
    queryKey: ["video", params.videoId],
    queryFn: async () => getVideo(params.videoId),
  });

  const [selectedImage, setSelectedImage] = useState<string>();

  useEffect(() => {
    if (video?.images?.length && !selectedImage) {
      setSelectedImage(video?.images?.[0]?.id ?? "");
    }
  }, [video]);

  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync: regenerateImage, isPending: imageLoading } =
    useGenerateImage({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["video", params.videoId],
        });
      },
    });

  function toggleEditing() {
    setIsEditing((prev) => !prev);
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-1 gap-4">
        <div className="h-full grow rounded-xl bg-secondary p-4 text-secondary-foreground/70">
          <h1 className="font-semibold">Text Timestamp</h1>
          <div className="mt-4">
            {
              video?.images?.find((image) => image.id === selectedImage)
                ?.timestamp
            }
          </div>
          <h1 className="mt-4 font-semibold">Generation Prompt</h1>
          {isEditing && !!video?.images ? (
            <Textarea
              className="mt-4 rounded-xl border-white/40 bg-transparent"
              placeholder="describe what's your video about. You can discuss the subject with AI to have the best formulation of it."
              {...register(
                `images.${video.images.findIndex(
                  (image) => image.id === selectedImage,
                )}.prompt`,
              )}
            />
          ) : (
            <div className="mt-4">
              {
                video?.images?.find((image) => image.id === selectedImage)
                  ?.prompt
              }
            </div>
          )}
          <div className="mt-4 flex items-center justify-end gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={toggleEditing} variant="outline">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    if (!selectedImage || !video) return;

                    await regenerateImage({
                      imageId: selectedImage,
                      prompt:
                        watch(
                          `images.${video.images.findIndex(
                            (image) => image.id === selectedImage,
                          )}.prompt`,
                        ) ?? "",
                    });

                    setIsEditing(false);
                  }}
                  className="gap-2"
                  disabled={imageLoading}
                >
                  Save
                  {imageLoading && <LoadingDots />}
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleEditing}
                  disabled={
                    !video?.images?.find((image) => image.id === selectedImage)
                      ?.prompt
                  }
                >
                  Edit Prompt
                </Button>
                <UploadButton
                  input={{
                    imageId: selectedImage!,
                  }}
                  endpoint="imageUploader"
                  appearance={{
                    allowedContent: {
                      display: "none",
                    },
                    button: {
                      borderRadius: "100px",
                      padding: "6px 16px",
                      height: "auto",
                      width: "auto",
                    },
                  }}
                  content={{
                    button({ ready }) {
                      if (ready) return <span>Upload your own image</span>;

                      return "Getting ready...";
                    },
                  }}
                  onClientUploadComplete={async () => {
                    await queryClient.invalidateQueries({
                      queryKey: ["video", params.videoId],
                    });
                  }}
                />
              </>
            )}
          </div>
        </div>
        <div className="min-w-[304px]">
          {selectedImage &&
          !imageLoading &&
          video?.images?.find((image) => image.id === selectedImage)?.url ? (
            <AspectRatio ratio={9 / 16}>
              <Image
                src={
                  video?.images?.find((image) => image.id === selectedImage)
                    ?.url ?? ""
                }
                fill
                alt="Image"
                className="rounded-md object-cover"
              />
            </AspectRatio>
          ) : (
            <div className="grid h-full w-full place-items-center rounded-lg bg-gray-300">
              <LoadingDots />
            </div>
          )}
        </div>
      </div>
      <div>
        <span>Timeline</span>
        <div className="flex gap-2">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <RadioGroup
              orientation="horizontal"
              className="flex gap-2 p-2"
              value={selectedImage}
              onValueChange={setSelectedImage}
            >
              {video?.images?.map((image) => (
                <ImageElement
                  key={image.id}
                  image={image}
                  script={watch("script.text")}
                />
              ))}
            </RadioGroup>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default ImagesTab;

function ImageElement({
  image,
  script,
}: {
  image: InferResultType<"image">;
  script: string;
}) {
  const queryClient = useQueryClient();
  const params = useParams<{ videoId: string }>();
  const { mutateAsync: generateImage } = useGenerateImage({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["video", params.videoId],
      });
    },
  });

  useQuery({
    queryKey: ["image", image.id],
    queryFn: () =>
      generateImage({
        imageId: image.id,
        prompt: image.prompt!,
      }),
    enabled: !!image.prompt && !!image.timestamp && !!script && !image.url,
    initialData: { url: image.url },
  });

  return (
    <div className="h-40 w-[90px]" key={image.id}>
      <RadioGroupItem className="peer sr-only" value={image.id} id={image.id} />
      <div className="rounded-md peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary">
        <Label htmlFor={image.id}>
          <AspectRatio ratio={9 / 16}>
            {image?.url ? (
              <Image
                src={image.url}
                fill
                alt="Image"
                className="rounded-md object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center rounded-lg bg-gray-300">
                <LoadingDots />
              </div>
            )}
          </AspectRatio>
        </Label>
      </div>
    </div>
  );
}
