import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, DallEAPIWrapper } from "@langchain/openai";
import type { NextRequest } from "next/server";
import { JsonOutputParser } from "@langchain/core/output_parsers";

const tool = new DallEAPIWrapper({
  n: 1, // Default
  model: "dall-e-3",
  size: "1024x1024",
});

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo-0125",
  temperature: 0,
});

const textTimestampsPrompt =
  ChatPromptTemplate.fromTemplate(`You're part of a video generation process, we're right now at images generation step, your goal is given a script that an audio AI would read, you have to split it into an array of text timestamps that would last approximately 4 seconds, every chunk of text in that array would be used to generate a prompt that would be given to an image generation ai.
  here is the script you should use to generate the text timestamps: 
  {script}
  
`);

const imageGenerationPrompt =
  ChatPromptTemplate.fromTemplate(`You're part of a video generation process, we're right now at images generation step, your goal is given a script that an audio AI would read, you have to split it into an array of text timestamps that would last approximately 4 seconds, every chunk of text in that array would be used to generate a prompt that would be given to an image generation ai.
  you've been given the following script:
  {script}
  and you have generated the following text timestamps:
  {text_timestamps}
  your goal now is to generate an array of prompts that will be used to generate the images
  the prompt should describe what the image should contain to illustrate the text timestamp taking the whole context in consideration.
  it is IMPORTANT tha the output is a json parsable array of strings.
`);

const testScript =
  "In a tiny village where flowers whispered and streams hummed, an old man named Eliot lived alone. One frosty morning, he discovered a glowing seed nestled beneath the snow. With a sense of wonder, he planted it in his garden. Throughout the harsh winter, he nurtured it, despite his neighbors’ disbelief. As spring embraced the land, a radiant, silver-leaved tree sprouted, towering and majestic. It bore a single, shimmering fruit. Eliot shared it with his village, and the fruit healed ailments and softened hearts. The tree, a symbol of hope and unity, brought the villagers together, forever changing the rhythm of their lives.";

export async function POST(req: NextRequest) {
  const jsonParser = new JsonOutputParser();

  const timestampChain = textTimestampsPrompt.pipe(model).pipe(jsonParser);

  const timestampStream = await timestampChain.stream({
    script: testScript,
  });

  let timestampArray;

  for await (const chunk of timestampStream) {
    timestampArray = chunk;
  }

  const imageGenerationChain = imageGenerationPrompt
    .pipe(model)
    .pipe(jsonParser);

  const imageGenerationStream = await imageGenerationChain.stream({
    script: testScript,
    text_timestamps: JSON.stringify(timestampArray),
  });

  let imagePrompts;
  for await (const chunk of imageGenerationStream) {
    console.log(chunk);

    imagePrompts = chunk;
  }

  // for every prompt in image prompts generate an image
  if (!imagePrompts) {
    throw new Error("Failed to generate image prompts");
  }

  const imageURL = await tool.invoke(
    `You're part of a video generation process, we're right now at images generation step, your goal is given a script that an audio AI would read, you have to split it into an array of text timestamps that would last approximately 4 seconds, every chunk of text in that array would be used to generate a prompt that would be given to an image generation ai.
    you've been given the following script:
    ${testScript}
    you're generating an image for the follwoing text timestamp:
    In a tiny village where flowers whispered and streams hummed, an old man named Eliot lived alone.
    and here is the prompt that is meant to help you generate the image:
    Illustrate a tiny village with flowers whispering and streams humming, showing an old man named Eliot living alone.
    now using this context generate a beautiful image that perfectly illustrates the text timestamp using the given prompt.
    `,
  );

  console.log(imageURL);

  // generate ana array of text timestamps DONE
  // make sure the array is well parsed DONE
  // using the array of text timestamps make an array of prompts that will be used to generate the images DONE
  // make sure it's well parsed DONE
  // using the array of prompts generate the images
  // return an array of text timestamps, prompts used, and the generated images

  return new Response("Hello");
}

// Example:
// A function that operates on finalized inputs
// rather than on an input_stream

// A function that does not operates on input streams and breaks streaming.
// const extractCountryNames = (inputs: Record<string, any>) => {
//     if (!Array.isArray(inputs.countries)) {
//       return "";
//     }
//     return JSON.stringify(inputs.countries.map((country) => country.name));
//   };

//   const chain = model.pipe(new JsonOutputParser()).pipe(extractCountryNames);

//   const stream = await chain.stream(
//     `output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`
//   );

//   for await (const chunk of stream) {
//     console.log(chunk);
//   }
