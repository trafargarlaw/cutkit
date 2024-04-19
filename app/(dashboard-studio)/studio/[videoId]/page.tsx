import { Studio } from "@/features/studio";
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
  console.log(video);

  if (!video) {
    redirect("/404");
  }

  return <Studio video={video} />;
}

export default StudioPage;
