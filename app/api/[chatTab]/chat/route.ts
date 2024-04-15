import { StepsFormData } from "@/app/(dashboard-studio)/studio/page";
import { env } from "@/env";
import { OpenAIStream, StreamingTextResponse, StreamData } from "ai";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const runtime = "edge";

function createSystemPrompt({
  step,
  data,
}: {
  step: string;
  data: StepsFormData;
}) {
  console.log("hey i've been called with ", data, step);

  switch (step) {
    case "subject":
      return `You are part of a process that automatically generates tiktok videos.
        The user will first decide on a subject summary, where we'd have a summary explanation of what the video will be about
        this step is the occasion for the ai to have a full idea about what's the video about.
        then after that there are 4 steps to follow.
        first step is to have a story made out of that subject summary.
        second step is to have a hook to make user stop scrolling.
        third step is have the script that an audio AI will read.
        fourth step is to have a list of images that will be used every 4 seconds in the video while the audio is playing.
        You are right now in a process where the user can discuss with you to generate the subject summary, your goal is to ask the user and understand from them what they want to make the video about, and then only after you understood what the user needs, you generate the summary description that the user would either confirm or ask you further questions.
        it is IMPORTANT for correct parsing that the format of your text is as follows:
        here is your normal text and when you want to seggest a summary description you use the following format:
        <<suggestion:here you put the plain text of the suggestion>>
        `;
    case "story": {
      if (!data.subject) throw new Error("subject is required");
      return `You are part of a process that automatically generates tiktok videos.
          The user will first decide on a subject summary, where we'd have a summary explanation of what the video will be about
          then after that there are 4 steps to follow.
          first step is to have a story made out of that subject summary.
          second step is to have a hook to make user stop scrolling.
          third step is have the script that an audio AI will read.
          fourth step is to have a list of images that will be used every 4 seconds in the video while the audio is playing.
          the user has chosen the subject summary and here is its description: ${data.subject} 
          You are right now the story step, your goal is to generate a story based on user requierements and the subject summary.
          it is IMPORTANT for correct parsing that the format of your suggestions is as follows:
          <<suggestion:here you put the markdown of your suggestion>>`;
    }
    case "hook": {
      if (!data.subject || !data.story)
        throw new Error("subject and story are required");
      return `You are part of a process that automatically generates tiktok videos.
        The user will first decide on a subject summary, where we'd have a summary explanation of what the video will be about
        then after that there are 4 steps to follow.
        first step is to have a story made out of that subject summary.
        second step is to have a hook to make user stop scrolling.
        third step is have the script that an audio AI will read.
        fourth step is to have a list of images that will be used every 4 seconds in the video while the audio is playing.
        the user has chosen the subject summary and here is its description: ${data.subject} 
        and they have chose the following story: ${data.story}
        You are right now the hook generation step, your goal is to generate some coherant catchy hooks that would stop the users from scrolling.
        your hook will be spoken by an AI voice in the video. so make sure it is catchy and interesting.
        it is IMPORTANT for correct parsing that the format of your suggestions is as follows:
        <<suggestion:here you put the markdown of your suggestion>>`;
    }
    default:
      return "You are part of a process that automatically generates tiktok videos.";
  }
}
const routeContextSchema = z.object({
  params: z.object({
    chatTab: z.string(),
  }),
});

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  try {
    const { messages, data } = (await req.json()) as {
      messages: ChatCompletionMessageParam[];
      data: StepsFormData;
    };

    const { params } = routeContextSchema.parse(context);

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-2024-04-09",
      stream: true,
      messages: [
        {
          role: "system",
          content: createSystemPrompt({
            step: params.chatTab,
            data,
          }),
        },
        ...messages,
      ],
    });

    // Instantiate the StreamData. It works with all API providers.

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream, {
      headers: { "X-RATE-LIMIT": "lol" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
