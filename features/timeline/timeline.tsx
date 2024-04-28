"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";

export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <ScrollArea className="h-[230px] w-[1000px] border-b bg-gray-100">
        <div className="flex h-8 min-w-[100px] border-b bg-black/10 text-xs">
          {Array.from({ length: 20 }, (_, i) => i).map((i) => (
            <div
              key={i}
              className="flex-end pointer-events-none flex h-[230px] w-[100px] min-w-[100px] items-start border-r px-0.5 py-1"
            >
              {i * 0.5}s
            </div>
          ))}
        </div>
        <div className="element relative h-[198px] w-full overflow-y-auto">
          {children}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
