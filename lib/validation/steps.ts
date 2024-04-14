import { z } from "zod";

export const stepsValidationSchema = z.object({
  subject: z
    .string()
    .min(1, "Please provide a subject or ask AI to generate one"),
  story: z.string().min(1, "Please provide a story or ask AI to generate one"),
  hook: z.string().min(1, "Please provide a hook or ask AI to generate one"),
  script: z
    .string()
    .min(1, "Please provide a script or ask AI to generate one"),
  images: z.array(z.string()).min(1, "Please provide at least one image"),
  selectedTab: z.string().default("subject"),
});
