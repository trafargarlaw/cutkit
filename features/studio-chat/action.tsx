import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  render,
} from "ai/rsc";
import { OpenAI } from "openai";
import { z } from "zod";
import { BotMessage } from "./components/message";
import SummaryCard from "./components/summary-card";

type AIStateItem =
  | {
      readonly role: "user" | "assistant" | "system";
      readonly content: string;
    }
  | {
      readonly role: "function";
      readonly content: string;
      readonly name: string;
    };

interface UIStateItem {
  readonly id: number;
  readonly display: React.ReactNode;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function Spinner() {
  return <div>Loading...</div>;
}

async function submitUserMessage(userInput: string): Promise<UIStateItem> {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  aiState.update([...aiState.get(), { role: "user", content: userInput }]);

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const ui = render({
    model: "gpt-4-turbo-2024-04-09",
    provider: openai,
    messages: [
      {
        role: "system",
        content: `
        You are part of a process that automatically generates tiktok videos.
        The user will first decide on a subject summary, where we'd have a summary explanation of what the video will be about
        this step is the occasion for the ai to have a full idea about what's the video about.
        then after that there are 4 steps to follow.
        first step is to have a story made out of that subject summary.
        second step is to have a hook to make user stop scrolling.
        third step is have the script that an audio AI will read.
        fourth step is to have a list of images that will be used every 4 seconds in the video while the audio is playing.
        You are right now in a process where the user can discuss with you to generate the subject summary, your goal is to ask the user and understand from them what they want to make the video about, and then generate the summary title/description that the user would either confirm or ask you further questions.
        When you generate the summary of the subject or making a suggestion, always call  \`display_summary_subject\` .
        `,
      },
      { role: "user", content: userInput },
      ...aiState.get(),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      } else {
        textStream.update(delta);
      }

      return textNode;
    },

    tools: {
      display_summary_subject: {
        description:
          "Display summary title and description that the ai generated",
        parameters: z
          .object({
            title: z.string(),
            description: z.string(),
          })
          .required(),
        render: async function* ({ title, description }) {
          yield <Spinner />;

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "display_summary_subject",
              content: JSON.stringify({ title, description }),
            },
          ]);

          return <SummaryCard title={title} description={description} />;
        },
      },
    },
  });

  return { id: Date.now(), display: ui };
}

const initialAIState: AIStateItem[] = [];
const initialUIState: UIStateItem[] = [
  {
    id: Date.now(),
    display: (
      <BotMessage content="Hello, I'm your assistant, let's discuss your video idea." />
    ),
  },
];

export const AI = createAI({
  actions: { submitUserMessage },
  initialUIState,
  initialAIState,
});
