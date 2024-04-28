import { Icons } from "@/components/icons";
import type { MediaElement, Track } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";

function ElementComponent({
  element,
  index,
  track,
}: {
  element: MediaElement;
  track: Track;
  index: number;
}) {
  const Icon = Icons[element.type as keyof typeof Icons];
  const color =
    element.type === "text"
      ? "bg-green-400"
      : element.type === "video"
        ? "bg-blue-400"
        : "bg-red-400";

  return (
    <Draggable draggableId={element.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            style={{
              width: `${(element.endTime - element.startTime) * 200}px`,
            }}
            className={cn(
              color,
              "handle ml-0 box-border h-[32px] overflow-hidden rounded-md",
            )}
          >
            <div className="h-full">
              <div className="pointer-events-none size-full">
                <div className="flex h-full w-full flex-nowrap items-center space-x-2 px-4">
                  <span>
                    <Icon className="size-4" />
                  </span>
                  <span className="truncate">{element.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default ElementComponent;
