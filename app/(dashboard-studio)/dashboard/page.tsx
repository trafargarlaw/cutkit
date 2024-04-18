"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingDots from "@/components/ui/loading-dots";
import { createVideo, getVideos } from "@/server/queries/video";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

function DashboardPage() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["createVideo"],
    mutationFn: () => createVideo(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
    },
  });
  const { data: videos, isSuccess } = useQuery({
    queryKey: ["videos"],
    queryFn: () => getVideos(),
  });

  async function handleCreateVideo() {
    await mutateAsync();
  }

  return (
    <div className="flex flex-col">
      <div className="ml-auto p-4">
        <Button onClick={handleCreateVideo}>Create video</Button>
      </div>

      <main className="flex flex-wrap gap-4 p-4">
        {isSuccess &&
          videos?.map((video) => (
            <Card key={video.id} className="relative">
              <Link
                className="absolute inset-0 z-10"
                href={`/studio/${video.id}`}
              >
                <span className="sr-only">View video</span>
              </Link>

              <div className="size-60 rounded-l bg-cyan-300"></div>

              <CardContent className="space-y-2 pt-4">
                <div className="line-clamp-2 font-medium">{video.title}</div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
      </main>
    </div>
  );
}

export default DashboardPage;
