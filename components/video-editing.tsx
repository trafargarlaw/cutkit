"use client";
import { Timeline, Track } from "@/features/timeline";
import ElementComponent from "@/features/timeline/components/element-component";
import useTimelineStore from "@/lib/store";

function VideoEditing() {
  const timelineStore = useTimelineStore();
  return (
    <div>
      <Timeline>
        {timelineStore.tracks.map((track) => (
          <Track key={track.id}>
            {track.elements.map((element) => (
              <ElementComponent key={element.id} element={element} />
            ))}
          </Track>
        ))}
      </Timeline>
    </div>
  );
}

export default VideoEditing;
