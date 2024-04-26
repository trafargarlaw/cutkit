"use server";
import "server-only";

import { db } from "../db";
import { type Video, video } from "../db/schema";
import { getServerAuthSession } from "../auth";
import { eq } from "drizzle-orm";
import { InferResultType } from "@/types";

export async function createVideo() {
  try {
    const session = await getServerAuthSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    await db.insert(video).values({
      userId,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getVideos() {
  try {
    const session = await getServerAuthSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const videos = await db.query.video.findMany({
      where: (model, { eq }) => eq(model.userId, userId),
    });

    return videos;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getVideo(
  videoId: string,
): Promise<InferResultType<"video", { audio: true; images: true }>> {
  try {
    const session = await getServerAuthSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const video = await db.query.video.findFirst({
      where: (model, { eq }) => eq(model.id, videoId),
      with: {
        audio: true,
        images: {
          orderBy(image, { asc }) {
            return asc(image.order);
          },
        },
      },
    });

    return video as InferResultType<"video", { audio: true; images: true }>;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateVideo(videoId: string, data: Partial<Video>) {
  try {
    const session = await getServerAuthSession();

    if (!session) {
      throw new Error("Unauthorized");
    }
    await db.update(video).set(data).where(eq(video.id, videoId));

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteVideo(videoId: string) {
  return await db.delete(video).where(eq(video.id, videoId));
}
