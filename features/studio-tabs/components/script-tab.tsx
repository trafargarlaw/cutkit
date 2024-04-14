import type { StepsFormData } from "@/app/(dashboard-studio)/studio/page";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

function ScriptTab() {
  const { register, watch, setValue } = useFormContext<StepsFormData>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // I don't know exactly how this tab works;
    // I'im going to assume that the script is IA generated at this step & editing is false by default
    setValue(
      "script",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    );
  }, [setValue]);

  function toggleEditing() {
    setIsEditing((prev) => !prev);
  }

  function handleConfirm() {
    setValue("selectedTab", "images");
  }

  return (
    <div className="rounded-xl bg-secondary p-4 text-secondary-foreground/80">
      {isEditing ? (
        <Textarea
          className="animate-fade-in-out mt-4 rounded-xl border-white/40 bg-transparent"
          value="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          {...register("script")}
        />
      ) : (
        <div className="animate-fade-in-out mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 items-center gap-x-2">
        <span className="font-bold">Voice over</span>

        {/* Maybe use combo-box instead of dropdown-menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-x-4 rounded-full border border-gray-100 p-1.5 px-1">
            Default
            <Icons.chevronDown className="size-4 text-primary-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Default ✓</DropdownMenuItem>
            <DropdownMenuItem>John Doe</DropdownMenuItem>
            <DropdownMenuItem>Record</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/**/}

        <Button size="lg" variant="outline">
          Clown my own voice
        </Button>
      </div>

      <div className="mt-4 flex justify-between">
        <Icons.play className="size-6 fill-primary-foreground" />
        <div className="text-secondary-foreground/50">waveform</div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" onClick={toggleEditing}>
          {isEditing ? "Save" : "Edit"}
        </Button>
        <Button
          size="sm"
          variant="default"
          disabled={!watch("script")}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default ScriptTab;
