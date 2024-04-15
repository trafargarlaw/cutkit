import { Icons } from "@/components/icons";
import React, { useRef, useState } from "react";

function AudioPreview({ voice }: { voice: Voice }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio", error);
      });
    }
    setIsPlaying(!isPlaying);
  };
  return (
    <button
      onClick={togglePlay}
      onPointerUp={(event) => {
        console.log("onPointerUp");
        event.stopPropagation();
      }}
      className="hidden size-6 items-center justify-center rounded-full border border-secondary bg-black group-hover:flex group-focus:flex"
    >
      {isPlaying ? (
        <Icons.pause className="size-3.5 fill-white " />
      ) : (
        <Icons.play className="size-3.5 fill-white " />
      )}
      <audio
        ref={audioRef}
        src={voice.preview_url}
        onEnded={() => setIsPlaying(false)}
      />
    </button>
  );
}

export default AudioPreview;
