"use server";
import "server-only";

import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { db } from "../db";
import { image } from "../db/schema";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo-0125",
  temperature: 0,
});

const textTimestampsPrompt =
  ChatPromptTemplate.fromTemplate(`You are an AI involved in a video generation process, specifically within the image generation step. You will be provided with a script that is intended to be narrated by an audio AI. Here are your instructions:
  Text Segmentation: Divide the script into manageable segments, each expected to be narrated in approximately 4 seconds. This division should prioritize natural language breaks and maintain the integrity of the information conveyed.
  Image Prompt Generation: For each text segment, create a detailed prompt that will guide an image generation AI to produce visuals that illustrate the content of that text segment. Your prompt should:
  Directly relate to the narrative and content of the text segment.
  Clearly describe key visual elements such as characters, settings, actions, and emotions.
  Ensure that the visual narrative aligns with the script's overall theme and specific messages.
  Output Format: Structure your output as a JSON-parsable array of objects. Each object should contain two keys:
  timestamp: The actual text of the segment that will be narrated. This should be verbatim from the script.
  prompt: The detailed description for the image generation AI, explaining what should be visually represented during the narration of the text in the timestamp, make sure the description has enough context of what should be shown since the image will be generated based on this description only.
  Here is the script you will use for this task:
  {script}
  in the object do not include anything other than the timestamp and the prompt.
  Please ensure that the output accurately reflects the text segments and includes compelling and contextually appropriate image prompts for each segment.
`);

// const imageGenerationPrompt =
//   ChatPromptTemplate.fromTemplate(`You're part of a video generation process, we're right now at images generation step, your goal is given a script that an audio AI would read, you have to split it into an array of text timestamps that would last approximately 4 seconds, every chunk of text in that array would be used to generate a prompt that would be given to an image generation ai.
//   you've been given the following script:
//   {script}
//   and you have generated the following text timestamps:
//   {text_timestamps}
//   your goal now is to generate an array of prompts that will be used to generate the images
//   the prompt should be very descriptive about what the image should contain to illustrate the text timestamp taking the whole context in consideration.
//   the description and the style should have some artistic direction that would be same for all the illustrations.
//   it is IMPORTANT tha the output is a json parsable array of strings.
// `);

// const testScript = `
// Capture the intensity! Dive deep into Bugha’s journey to becoming a Fortnite world champion. In the summer of 2019, the esports arena was electrified as the first-ever Fortnite World Cup unfolded. From hundreds of contenders, one name resonated above all: Bugha. This young prodigy emerged not only as a participant but as a phenomenon, clinching victory with his extraordinary skills.

// The competition was fierce with the globe watching. Early on, Bugha demonstrated an exceptional knack for strategy and precision, dominating the leaderboard. His gameplay was not just about quick reflexes, but a masterclass in strategic planning and flawless execution.

// As the stakes climbed, so did the intensity. Each match pushed competitors to their limits, but Bugha remained unshaken, outsmarting and outplaying his toughest adversaries. The climax of his journey came during the nail-biting final round, where he secured his legacy and the grand prize with a series of expert maneuvers that left the audience in awe.

// Victory was just the beginning for Bugha. Post-tournament life brought endorsements and sponsorships, yet he stayed true to his love for gaming, continually sharpening his skills and inspiring others. Now, let’s learn straight from Bugha. Tune into his top tips on mastering Fortnite—from building defenses to executing winning tactics—designed to elevate your game to championship levels. Who knows? The next world champion could be you.`;

export async function generateTimestampsAndPrompts({
  script,
  videoId,
}: {
  script: string;
  videoId: string;
}) {
  const jsonParser = new JsonOutputParser();

  const timestampChain = textTimestampsPrompt.pipe(model).pipe(jsonParser);

  const timestampStream = await timestampChain.stream({
    script,
  });

  let data: { timestamp: string; prompt: string }[] = [];

  for await (const chunk of timestampStream) {
    data = chunk as { timestamp: string; prompt: string }[];
  }

  if (!data) {
    throw new Error("Failed to generate timestamps");
  }

  for (const element of data) {
    await db.insert(image).values({
      videoId,
      timestamp: element.timestamp,
      prompt: element.prompt,
      order: data.indexOf(element),
    });
  }

  return data;
}

export async function getImages(videoId: string) {
  const images = await db.query.image.findMany({
    where: (model, { eq }) => eq(model.videoId, videoId),
  });

  return images;
}
