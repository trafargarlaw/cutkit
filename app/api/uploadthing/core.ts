import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { audio } from "@/server/db/schema";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "16MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await getServerAuthSession();

      if (!session) throw new UploadThingError("Unauthorized");

      const user = session.user;

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  audioUploader: f({ audio: { maxFileSize: "32MB" } })
    .input(
      z.object({
        videoId: z.string(),
        voice: z.string(),
      }),
    )
    .middleware(async ({ input }) => {
      const session = await getServerAuthSession();
      console.log(session);

      if (!session) throw new UploadThingError("Unauthorized");

      const user = session.user;

      console.log(user);

      return { userId: user.id, videoId: input.videoId, voice: input.voice };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      try {
        // Attempt to insert a new audio record
        await db
          .insert(audio)
          .values({
            videoId: metadata.videoId,
            url: file.url,
            voice: metadata.voice,
          })
          .onConflictDoUpdate({
            target: audio.videoId,
            set: {
              url: file.url,
              voice: metadata.voice,
            },
          });
      } catch (error) {
        console.error("Error inserting/updating audio record:", error);
        throw new UploadThingError("Database operation failed");
      }

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
