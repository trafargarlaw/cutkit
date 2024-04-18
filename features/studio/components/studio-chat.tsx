"use client";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import type { Message } from "ai";
import { useChat } from "ai/react";
import Markdown from "markdown-to-jsx";
import React from "react";
import { useFormContext } from "react-hook-form";

import type { StepsFormData } from "../studio";
import { BotMessage, UserMessage } from "./message";
import { SuggestionCard } from "./suggestion-card";

function getInitialMessagesFromTab(tab: string) {
  switch (tab) {
    case "subject":
      return [
        {
          id: "1",
          content:
            "Hello, Let's formulate your video subject. What's your video about?",
          role: "assistant",
        },
      ] satisfies Message[];
    case "story":
      return [
        {
          id: "1",
          content: "Let's now craft the story of your video!",
          role: "assistant",
        },
      ] satisfies Message[];
    case "hook":
      return [
        {
          id: "1",
          content: "Now, a catchy hook for your video!",
          role: "assistant",
        },
      ] satisfies Message[];
    case "script":
      return [
        {
          id: "1",
          content: "Let's write the script of your video!",
          role: "assistant",
        },
      ] satisfies Message[];
    case "images":
      return undefined;
    default:
      return undefined;
  }
}

export function StudioChat() {
  const form = useFormContext<StepsFormData>();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: form.watch("selectedTab"),
    api: `/api/${form.watch("selectedTab")}/chat`,
    body: {
      data: form.getValues(),
    },
    initialMessages: getInitialMessagesFromTab(form.watch("selectedTab")),
  });

  const processSuggestionContent = (content: string) => {
    const suggestionContent = content.match(/<<suggestion:(.*?)>>/s)?.[1];
    if (!suggestionContent) return content.replace("<<suggestion:", "");

    const tab = form.watch("selectedTab");

    return content.replace(/<<suggestion:(.*?)>>/gs, (_, sug: string) => {
      return `<Suggestion coucou="coucou" text="${sug.replace(`"`, "")}" tab="${tab}" />`;
    });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-xl bg-slate-100 p-4">
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === "user" ? (
              <UserMessage>{m.content}</UserMessage>
            ) : (
              <BotMessage>
                <Markdown
                  options={{
                    overrides: {
                      Suggestion: {
                        component: SuggestionCard,
                      },
                    },
                    createElement(type, props, children) {
                      return (
                        <div className="prose mb-2">
                          {React.createElement(type, props, children)}
                        </div>
                      );
                    },
                  }}
                >
                  {processSuggestionContent(m.content)}
                </Markdown>
              </BotMessage>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <button
          type="submit"
          className="absolute right-1 top-1 grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground"
        >
          <Icons.arrowUp className="size-6 " />
        </button>
        <Input
          value={input}
          onChange={handleInputChange}
          className="h-12 rounded-full pr-12"
          placeholder="Type a message"
        />
      </form>
    </div>
  );
}
