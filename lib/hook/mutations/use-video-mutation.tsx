import type { Video } from "@/server/db/schema";
import { updateVideo } from "@/server/queries/video";
import { useMutation } from "@tanstack/react-query";

export function useVideoMutation() {
  const mutation = useMutation({
    mutationKey: ["updateVideo"],
    mutationFn: async ({
      videoId,
      data,
    }: {
      videoId: string;
      data: Partial<Video>;
    }) => await updateVideo(videoId, data),
  });

  return mutation;
}
