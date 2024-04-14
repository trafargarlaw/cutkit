"use client";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useActions, useUIState } from "ai/rsc";
import { useState } from "react";
import type { AI } from "./actions/action";
import { UserMessage } from "./components/message";

function StudioChat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 rounded-xl bg-slate-100 p-4">
        {messages.map((message) => {
          return <div key={message.id}>{message.display}</div>;
        })}
      </div>
      <form
        className="relative"
        onSubmit={async (e) => {
          e.preventDefault();

          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <UserMessage>{inputValue}</UserMessage>,
            },
          ]);

          const responseMessage = await submitUserMessage(inputValue);
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);

          setInputValue("");
        }}
      >
        <button
          type="submit"
          className="absolute right-1 top-1 grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground"
        >
          <Icons.arrowUp className="size-6 " />
        </button>
        <Input
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
          className="h-12 rounded-full pr-12"
          placeholder="Type a message"
        />
      </form>
    </div>
  );
}

export default StudioChat;
