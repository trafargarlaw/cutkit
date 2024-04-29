import { cn } from "@/lib/utils";
import { Droppable } from "@hello-pangea/dnd";

export function Track({
  children,
  trackId,
}: {
  children: React.ReactNode;
  trackId: string;
}) {
  return (
    <Droppable droppableId={trackId} direction="horizontal">
      {(provided, snapshot) => (
        <div
          className="flex min-h-[32px]"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {children}

          <div className={snapshot.isDraggingOver ? "bg-blue-200" : ""}>
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
