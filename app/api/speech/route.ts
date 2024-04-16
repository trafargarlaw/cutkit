import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = (await req.json()) as {
      text: string;
      voice: string;
    };

    const options = {
      method: "POST",
      headers: {
        "xi-api-key": "afb4007c8f3485cd1b9289a0f7bd0ebd",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    };

    // Start the fetch request
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream`,
      options,
    );

    if (!res.body) {
      throw new Error("Failed to get response body");
    }

    // Create a new ReadableStream to manage the response
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const initialData = encoder.encode("Starting audio stream...");
        controller.enqueue(initialData);
        console.log("Stream initialized and initial data sent.");
        if (res.body === null) {
          throw new Error("Response body is null");
        }

        const reader = res.body.getReader();
        function push() {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                console.log("Streaming finished.");
                controller.close();
                return;
              }
              console.log("Streaming data chunk.");
              controller.enqueue(value);
              push();
            })
            .catch((error) => {
              console.error("Stream reading failed:", error);
              controller.error(error);
              controller.close();
            });
        }

        push();
      },
    });
    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
