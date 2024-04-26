import { z } from "zod";

export const stepsValidationSchema = z.object({
  subject: z
    .string()
    .min(1, "Please provide a subject or ask AI to generate one"),
  story: z.string().min(1, "Please provide a story or ask AI to generate one"),
  hook: z.string().min(1, "Please provide a hook or ask AI to generate one"),
  script: z.object({
    text: z
      .string()
      .min(1, "Please provide a script or ask AI to generate one"),
    voice: z.string().min(1, "Please provide a voice"),
  }),
  images: z.array(
    z.object({
      videoId: z.string(),
      id: z.string(),
      url: z.string().nullable(),
      timestamp: z.string().nullable(),
      prompt: z.string().nullable(),
    }),
  ),
  selectedTab: z.string().default("subject"),
  title: z.string().default("Untitled"),
  audioUrl: z.string().optional(),
});
