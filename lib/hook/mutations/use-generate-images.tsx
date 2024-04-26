import { generateTimestampsAndPrompts } from "@/server/queries/images";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export function useGenerateImageData(
  options?: UseMutationOptions<
    { timestamp: string; prompt: string }[],
    Error,
    { script: string; videoId: string }
  >,
) {
  const mutation = useMutation({
    mutationKey: ["generateImageData"],
    mutationFn: async ({
      script,
      videoId,
    }: {
      script: string;
      videoId: string;
    }) => {
      return generateTimestampsAndPrompts({
        script,
        videoId,
      });
    },
    ...options,
  });

  return mutation;
}

export function useGenerateImage(
  options?: UseMutationOptions<
    unknown,
    Error,
    { imageId: string; prompt: string }
  >,
) {
  const mutation = useMutation({
    mutationKey: ["generateImage"],
    mutationFn: async ({
      imageId,
      prompt,
    }: {
      imageId: string;
      prompt: string;
    }) => {
      return (await fetch(`/api/images/generate`, {
        method: "POST",
        body: JSON.stringify({
          prompt,
          imageId,
        }),
      }).then((res) => res.json())) as Promise<{ url: string }>;
    },
    ...options,
  });

  return mutation;
}
