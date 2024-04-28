"use client";
import useTimelineStore from "@/lib/store";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import React from "react";

export function Timeline({ children }: { children: React.ReactNode }) {
  const { moveElementBetweenTracks, moveElementWithinTrack } =
    useTimelineStore();

  function handleDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    console.log(result);

    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index !== result.source.index
    ) {
      // Reordering within the same track
      moveElementWithinTrack(
        result.source.droppableId,
        result.draggableId,
        result.source.index,
        result.destination.index,
      );
    } else if (result.destination.droppableId !== result.source.droppableId) {
      // Moving between different tracks
      moveElementBetweenTracks(
        result.draggableId,
        result.source.droppableId,
        result.destination.droppableId,
        result.destination.index,
      );
    }
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex">
        <div className="h-[230px] w-full overflow-y-auto border-b bg-gray-100">
          <div className="flex h-8 w-fit border-b bg-blue-600/10 text-xs">
            {Array.from({ length: 20 }, (_, i) => i).map((i) => (
              <div
                key={i}
                className="flex-end pointer-events-none flex h-[230px] w-[100px] min-w-[100px] items-start border-r px-0.5 py-1"
              >
                {i * 0.5}s
              </div>
            ))}
          </div>
          <div className="element relative h-[198px] w-full">{children}</div>
        </div>
      </div>
    </DragDropContext>
  );
}
