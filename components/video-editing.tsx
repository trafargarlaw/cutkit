"use client";
import { Timeline, Track } from "@/features/timeline";
import ElementComponent from "@/features/timeline/components/element-component";
import useTimelineStore from "@/lib/store";

function VideoEditing() {
  const timelineStore = useTimelineStore();
  return (
    <div className="overflow-hidden">
      <Timeline>
        {timelineStore.tracks.map((track) => (
          <Track key={track.id} trackId={track.id}>
            {track.elements.map((element, index) => (
              <ElementComponent
                key={element.id}
                track={track}
                element={element}
                index={index}
              />
            ))}
          </Track>
        ))}
      </Timeline>
    </div>
  );
}

export default VideoEditing;
