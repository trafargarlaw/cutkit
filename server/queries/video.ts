"use server";
import "server-only";

import { db } from "../db";
import { video } from "../db/schema";
import { getServerAuthSession } from "../auth";

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
  }
}
