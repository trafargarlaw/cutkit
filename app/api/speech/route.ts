import { env } from "@/env";
import { ElevenLabsClient, play } from "elevenlabs";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = (await req.json()) as {
      text: string;
      voice: string;
    };

    const elevenlabs = new ElevenLabsClient({
      apiKey: env.ELEVENLABS_API_KEY,
    });

    const audioStream = await elevenlabs.generate({
      voice,
      text,
      model_id: "eleven_multilingual_v2",
      stream: true,
    });

    const readableStream = new ReadableStream({
      start(controller) {
        audioStream.on("data", (chunk: Buffer) =>
          controller.enqueue(new Uint8Array(chunk)),
        );
        audioStream.on("end", () => controller.close());
        audioStream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
