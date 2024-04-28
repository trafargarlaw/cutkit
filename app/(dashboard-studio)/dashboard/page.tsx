"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import LoadingDots from "@/components/ui/loading-dots";
import { createVideo, deleteVideo, getVideos } from "@/server/queries/video";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
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

  const { mutateAsync: deleteVideoAsync } = useMutation({
    mutationKey: ["deleteVideo"],
    mutationFn: (id: string) => deleteVideo(id),
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
            <Card key={video.id} className="relative overflow-hidden">
              <div className="size-60 bg-slate-300">
                <Link
                  className="z-10 flex size-full justify-end"
                  href={`/studio/${video.id}`}
                >
                  <span className="sr-only">View video</span>
                </Link>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="absolute right-2 top-2 rounded-full bg-gray-100 p-1.5">
                  <Icons.ellipsis className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={async () => {
                      await deleteVideoAsync(video.id);
                    }}
                    className="text-red-500"
                  >
                    Delete video
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/studio/editing/${video.id}`}>
                      Start editing
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
