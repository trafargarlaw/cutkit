import type { StepsFormData } from "@/app/(dashboard-studio)/studio/page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

function SubjectTab() {
  const { register, watch, setValue } = useFormContext<StepsFormData>();

  const [isEditing, setIsEditing] = useState(() =>
    !watch("subject") ? true : false,
  );

  function toggleEditing() {
    setIsEditing((prev) => !prev);
  }

  function handleConfirm() {
    setValue("selectedTab", "story");
  }

  return (
    <div className="rounded-xl bg-secondary p-4 text-secondary-foreground/70">
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
