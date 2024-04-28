import VideoEditing from "@/components/video-editing";
import { getVideo } from "@/server/queries/video";
import { redirect } from "next/navigation";

async function StudioPage({
  params,
}: {
  params: {
    videoId: string;
  };
}) {
  const video = await getVideo(params.videoId);

  if (!video) {
    redirect("/404");
  }

  return (
    <div>
      <VideoEditing />
    </div>
  );
}

export default StudioPage;
