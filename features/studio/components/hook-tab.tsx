import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { StepsFormData } from "../studio";

export function HookTab() {
  const { register, watch, setValue, getValues } =
    useFormContext<StepsFormData>();

  const { append } = useChat({
    id: "script",
    api: "/api/script/chat",
    body: {
      data: getValues(),
    },
  });

  const [isEditing, setIsEditing] = useState(() =>
    !watch("hook") ? true : false,
  );

  function toggleEditing() {
    setIsEditing((prev) => !prev);
  }

  async function handleConfirm() {
    setValue("selectedTab", "script");
    await append({
      id: "1",
      content: "Generate a first script draft with the given info.",
      role: "user",
    });
  }

  return (
    <div className="h-full rounded-xl bg-secondary p-4 text-secondary-foreground/70">
      <h1 className="font-semibold">Let’s create a catchy hook!</h1>
      {isEditing ? (
        <Textarea
          className="mt-4 rounded-xl border-white/40 bg-transparent"
          placeholder="Write your catchy hook or use a generated one"
          {...register("hook")}
        />
      ) : (
        <div className="mt-4">{watch("hook")}</div>
      )}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleEditing}
          disabled={!watch("hook")}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
        <Button
          size="sm"
          variant="default"
          disabled={!watch("hook")}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
