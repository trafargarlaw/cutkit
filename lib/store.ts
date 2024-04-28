import { create } from "zustand";

export interface MediaElement {
  id: string;
  type: "image" | "video" | "text";
  startTime: number;
  endTime: number;
  src?: string;
  content?: string;
}

export interface Track {
  id: string;
  elements: MediaElement[];
}

interface TimelineState {
  tracks: Track[];
  moveElementWithinTrack: (
    trackId: string,
    draggableId: string,
    oldIndex: number,
    newIndex: number,
  ) => void;

  moveElementBetweenTracks: (
    elementId: string,
    sourceTrackId: string,
    destinationTrackId: string,
    destinationIndex: number,
  ) => void;
  setElementStartTime: (
    trackId: string,
    elementId: string,
    newStartTime: number,
  ) => void;
}

const useTimelineStore = create<TimelineState>((set) => ({
  tracks: [
    {
      id: "track-1",
      elements: [
        {
          id: "element-1",
          startTime: 0,
          endTime: 2,
          type: "image",
        },
        {
          id: "element-2",
          startTime: 3,
          endTime: 4,
          type: "text",
          content: "Hello, world!",
        },
        {
          id: "element-3",
          startTime: 5,
          endTime: 7,
          type: "video",
        },
      ],
    },
    {
      id: "track-2",
      elements: [],
    },
    {
      id: "track-3",
      elements: [],
    },
    {
      id: "track-4",
      elements: [],
    },
    {
      id: "track-5",
      elements: [],
    },
    {
      id: "track-6",
      elements: [],
    },
    {
      id: "track-7",
      elements: [],
    },
    {
      id: "track-8",
      elements: [],
    },
    {
      id: "track-9",
      elements: [],
    },
  ],

  moveElementWithinTrack: (
    trackId: string,
    draggableId: string,
    oldIndex: number,
    newIndex: number,
  ) =>
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id === trackId) {
          const newElements = Array.from(track.elements);
          const [movedElement] = newElements.splice(oldIndex, 1);
          if (!movedElement) return track;
          newElements.splice(newIndex, 0, movedElement);

          return { ...track, elements: newElements };
        }
        return track;
      }),
    })),

  moveElementBetweenTracks: (
    elementId: string,
    sourceTrackId: string,
    destinationTrackId: string,
    destinationIndex: number,
  ) =>
    set((state) => {
      const sourceTrack = state.tracks.find(
        (track) => track.id === sourceTrackId,
      );
      const destinationTrack = state.tracks.find(
        (track) => track.id === destinationTrackId,
      );
      if (!sourceTrack || !destinationTrack) return { ...state };

      const elementToMove = sourceTrack.elements.find(
        (element) => element.id === elementId,
      );
      if (!elementToMove) return { ...state };

      // Remove element from source track
      const newSourceElements = sourceTrack.elements.filter(
        (element) => element.id !== elementId,
      );
      // Insert element into destination track
      const newDestinationElements = [...destinationTrack.elements];
      newDestinationElements.splice(destinationIndex, 0, elementToMove);

      return {
        tracks: state.tracks.map((track) => {
          if (track.id === sourceTrackId) {
            return { ...track, elements: newSourceElements };
          } else if (track.id === destinationTrackId) {
            return { ...track, elements: newDestinationElements };
          }
          return track;
        }),
      };
    }),
  setElementStartTime: (trackId, elementId, newStartTime) =>
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            elements: track.elements.map((element) => {
              if (element.id === elementId) {
                return { ...element, startTime: newStartTime };
              }
              return element;
            }),
          };
        }
        return track;
      }),
    })),
}));

export default useTimelineStore;
