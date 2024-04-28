import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const video = createTable(
  "video",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    title: text("title").default("Untitled"),
    thumbnail: text("thumbnail"),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    subject: text("subject"),
    story: text("story"),
    hook: text("hook"),
    script: text("script"),
    voice: varchar("voice", { length: 255 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (video) => ({
    userIdIdx: index("video_userId_idx").on(video.userId),
  }),
);

export const audio = createTable(
  "audio",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    videoId: uuid("videoId")
      .notNull()
      .references(() => video.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .unique(),
    url: text("url"),
    voice: varchar("voice", { length: 255 }),
  },
  (audio) => ({
    videoIdIdx: index("audio_videoId_idx").on(audio.videoId),
  }),
);

export const videoRelations = relations(video, ({ one, many }) => ({
  audio: one(audio, { fields: [video.id], references: [audio.videoId] }),
  images: many(image),
  transcriptions: many(transcription),
}));

export const image = createTable(
  "image",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    videoId: uuid("videoId")
      .notNull()
      .references(() => video.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    url: text("url"),
    timestamp: text("timestamp"),
    prompt: text("prompt"),
    order: integer("order"),
  },
  (image) => ({
    videoIdIdx: index("image_videoId_idx").on(image.videoId),
  }),
);

export const transcription = createTable(
  "transcription",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    videoId: uuid("videoId")
      .notNull()
      .references(() => video.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    startTime: real("startTime").notNull(),
    endTime: real("endTime").notNull(),
    content: text("content").notNull(),
  },
  (transcription) => ({
    videoIdIdx: index("transcription_videoId_idx").on(transcription.videoId),
  }),
);

export const imageRelations = relations(image, ({ one }) => ({
  video: one(video, { fields: [image.videoId], references: [video.id] }),
}));

export const transcriptionRelations = relations(transcription, ({ one }) => ({
  video: one(video, {
    fields: [transcription.videoId],
    references: [video.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type Video = typeof video.$inferSelect;
export type Image = typeof image.$inferSelect;
export type Audio = typeof audio.$inferSelect;
