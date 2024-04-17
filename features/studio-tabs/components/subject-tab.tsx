import type { StepsFormData } from "@/app/(dashboard-studio)/studio/page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

function SubjectTab() {
  const { register, watch, setValue, getValues } =
    useFormContext<StepsFormData>();
  const { append } = useChat({
    id: "story",
    api: "/api/story/chat",
    body: {
      data: getValues(),
    },
  });

  const [isEditing, setIsEditing] = useState(() =>
    !watch("subject") ? true : false,
  );

  function toggleEditing() {
    setIsEditing((prev) => !prev);
  }

  async function handleConfirm() {
    setValue("selectedTab", "story");
    await append({
      id: "1",
      content: "Generate a first story draft with our chosen subject.",
      role: "user",
    });
  }

  return (
    <div className="h-full rounded-xl bg-secondary p-4 text-secondary-foreground/70">
      <h1 className="font-semibold">What&apos;s your video about?</h1>
      {isEditing ? (
        <Textarea
          className="mt-4 rounded-xl border-white/40 bg-transparent"
          placeholder="describe what's your video about. You can discuss the subject with AI to have the best formulation of it."
          {...register("subject")}
        />
      ) : (
        <div className="mt-4">{watch("subject")}</div>
      )}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleEditing}
          disabled={!watch("subject")}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
        <Button
          size="sm"
          variant="default"
          disabled={!watch("subject")}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default SubjectTab;
