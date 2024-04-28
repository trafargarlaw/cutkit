import { create } from "zustand";

export interface MediaElement {
  id?: string;
  type: "image" | "audio" | "text";
  startTime: number;
  endTime: number;
  src?: string;
  content?: string;
}

interface Track {
  id: string;
  elements: MediaElement[];
}

interface TimelineState {
  tracks: Track[];
  addElement: (trackId: string, element: MediaElement) => void;
  removeElement: (trackId: string, elementId: string) => void;
  setElementStartTime: (
    trackId: string,
    elementId: string,
    startTime: number,
  ) => void;
  setElementEndTime: (
    trackId: string,
    elementId: string,
    endTime: number,
  ) => void;
  setElementContent: (
    trackId: string,
    elementId: string,
    content: string,
  ) => void;
  setElementSrc: (trackId: string, elementId: string, src: string) => void;
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
          type: "audio",
        },
      ],
    },
  ],
  addElement: (trackId, element) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? { ...track, elements: [...track.elements, element] }
          : track,
      ),
    })),
  removeElement: (trackId, elementId) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              elements: track.elements.filter((e) => e.id !== elementId),
            }
          : track,
      ),
    })),
  setElementContent: (trackId, elementId, content) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              elements: track.elements.map((e) =>
                e.id === elementId ? { ...e, content } : e,
              ),
            }
          : track,
      ),
    })),
  setElementEndTime: (trackId, elementId, endTime) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              elements: track.elements.map((e) =>
                e.id === elementId ? { ...e, endTime } : e,
              ),
            }
          : track,
      ),
    })),
  setElementSrc: (trackId, elementId, src) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              elements: track.elements.map((e) =>
                e.id === elementId ? { ...e, src } : e,
              ),
            }
          : track,
      ),
    })),
  setElementStartTime: (trackId, elementId, startTime) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              elements: track.elements.map((e) =>
                e.id === elementId ? { ...e, startTime } : e,
              ),
            }
          : track,
      ),
    })),
}));

export default useTimelineStore;
