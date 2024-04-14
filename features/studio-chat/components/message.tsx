"use client";

import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>{children}</div>
    </div>
  );
}

export function BotMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("flex items-start gap-2")}>
      <div className="mt-1 rounded-full bg-secondary p-2">
        <Icons.logo className=" size-5" />
      </div>
      <div>{children}</div>
    </div>
  );
}
