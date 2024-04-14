import type { StepsFormData } from "@/app/(dashboard-studio)/studio/page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

function StoryTab() {
  const { register, watch, setValue } = useFormContext<StepsFormData>();

  const [isEditing, setIsEditing] = useState(() =>
    !watch("story") ? true : false,
  );

  function toggleEditing() {
    setIsEditing((prev) => !prev);
  }

  function handleConfirm() {
    setValue("selectedTab", "story");
  }

  return (
    <div className="rounded-xl bg-secondary p-4 text-secondary-foreground/70">
      <h1 className="font-semibold">Now let’s work on the story!</h1>
      {isEditing ? (
        <Textarea
          className="mt-4 rounded-xl border-white/40 bg-transparent"
          placeholder="Write your video’s story or ask the Ai to help you make one."
          {...register("story")}
        />
      ) : (
        <div className="mt-4">{watch("story")}</div>
      )}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleEditing}
          disabled={!watch("story")}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
        <Button
          size="sm"
          variant="default"
          disabled={!watch("story") || !watch("subject")}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default StoryTab;
