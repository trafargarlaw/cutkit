import { db } from "@/server/db";
import { image } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import Replicate from "replicate";
import { UTApi } from "uploadthing/server";

const replicate = new Replicate({
  auth: "8d153356dbc18f9cdeffc9e3ae7c2cc02d23e900",
});

const utapi = new UTApi();

export async function POST(req: NextRequest) {
  const { prompt, imageId } = (await req.json()) as {
    prompt: string;
    imageId: string;
  };

  console.log(prompt);

  const output = (await replicate.run(
    "bytedance/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a",
    {
      input: {
        prompt,
        width: 720,
        height: 1280,
        scheduler: "K_EULER",
        num_outputs: 1,
        guidance_scale: 0,
        negative_prompt: "worst quality, low quality",
        num_inference_steps: 4,
      },
    },
  )) as string[];

  const result = await utapi.uploadFilesFromUrl(output);
  await db
    .update(image)
    .set({ url: result[0]?.data?.url, prompt })
    .where(eq(image.id, imageId));

  return NextResponse.json({ url: result[0]?.data?.url }, { status: 200 });
}
