import { Icons } from "@/components/icons";
import type { MediaElement } from "@/lib/store";
import { cn } from "@/lib/utils";
import Draggable from "react-draggable";

function ElementComponent({ element }: { element: MediaElement }) {
  const Icon = Icons[element.type as keyof typeof Icons];
  const color =
    element.type === "text"
      ? "bg-green-400"
      : element.type === "audio"
        ? "bg-blue-400"
        : "bg-red-400";

  return (
    <Draggable
      handle=".handle"
      defaultPosition={{
        x: element.startTime * 200,
        y: 0,
      }}
      grid={[1, 32]}
      bounds=".element"
    >
      <div
        className={cn(
          color,
          "handle ml-0 box-border h-[32px]  overflow-hidden rounded-md",
        )}
        style={{
          width: `${(element.endTime - element.startTime) * 200}px`,
        }}
      >
        <div className="h-full">
          <div className="pointer-events-none size-full">
            <div className="flex h-full w-full flex-nowrap items-center space-x-2  px-4">
              <span>
                <Icon className="size-4" />
              </span>
              <span className="truncate">{element.type}</span>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}

export default ElementComponent;
