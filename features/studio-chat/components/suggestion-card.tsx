import type { StepsFormData } from "@/app/(dashboard-studio)/studio/page";
import { Button } from "@/components/ui/button";
import React from "react";
import { useFormContext } from "react-hook-form";
import ReactMarkdown from "react-markdown";

export function SuggestionCard({
  tab,
  text,
}: {
  tab:
    | "subject"
    | "story"
    | "hook"
    | "script"
    | "images"
    | "selectedTab"
    | `images.${number}`;
  text: string;
}) {
  const form = useFormContext<StepsFormData>();

  return (
    <div className="flex flex-col rounded-xl bg-white p-4 text-start ">
      <ReactMarkdown className="prose ">{text}</ReactMarkdown>
      <Button
        className="ml-auto mt-2 border-primary text-primary/90"
        onClick={() => {
          if (tab === "script") {
            form.setValue("script.text", text);
            return;
          }
          form.setValue(tab, text);
        }}
        variant="outline"
      >
        Select this suggestion
      </Button>
    </div>
  );
}
