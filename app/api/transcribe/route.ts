import { env } from "@/env";
import { db } from "@/server/db";
import { transcription } from "@/server/db/schema";
import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { audioUrl, videoId } = (await req.json()) as {
    audioUrl: string;
    videoId: string;
  };

  if (!audioUrl || !videoId) {
    return new Response("Missing audioUrl", { status: 400 });
  }

  try {
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error("Failed to fetch audio");
    }

    const transcriptions = (await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioResponse,
      language: "en",
      timestamp_granularities: ["word"],
      response_format: "verbose_json",
    })) as {
      text: string;
      words: {
        start: number;
        end: number;
        word: string;
      }[];
    };

    const words = transcriptions.words.map((word) => ({
      videoId,
      startTime: word.start,
      endTime: word.end,
      content: word.word,
    }));

    // insert many
    await db.insert(transcription).values(words).execute();

    return NextResponse.json(
      {
        transcriptions,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
