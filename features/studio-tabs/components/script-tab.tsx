import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type StepsFormType } from "../studio-tabs";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

type ScriptTabProps = {
  form: StepsFormType;
};

function ScriptTab({ form }: ScriptTabProps) {
  const { register, watch, setValue } = form;
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // I don't know exactly how this tab works; 
    // I'im going to assume that the script is IA generated at this step & editing is false by default
    setValue("script", "Lorem ipsum dolor sit amet, consectetur adipiscing elit");
  }, [setValue]);

  function toggleEditing() {
    setIsEditing((prev) => !prev);
  }

  function handleConfirm() {
    form.setValue("selectedTab", "images");
  }

  return (
    <div className="rounded-xl bg-secondary p-4 text-secondary-foreground/80">
      {isEditing ? (
        <Textarea
          className="mt-4 rounded-xl border-white/40 bg-transparent animate-fade-in-out"
          value="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          {...register("script")}
        />
      ) : (
        <div className="mt-4 animate-fade-in-out">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
      )}

      <div className="grid grid-cols-3 mt-4 items-center gap-x-2">
        <span className="font-bold">Voice over</span>

        {/* Maybe use combo-box instead of dropdown-menu */}
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full border border-gray-100 p-1.5 flex items-center px-1 gap-x-4">
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

        <Button size="lg" variant="outline">Clown my own voice</Button>
      </div>

      <div className="flex justify-between mt-4">
        <Icons.play className="size-6 fill-primary-foreground" />
        <div className="text-secondary-foreground/50">waveform</div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleEditing}
        >
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
