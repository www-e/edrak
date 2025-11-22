import { useState, useEffect, useRef } from "react";

interface VideoTimestampHook {
  currentTime: number;
  formatTime: (seconds: number) => string;
  captureTimestamp: () => number;
}

export const useVideoTimestamp = (videoRef: React.MutableRefObject<HTMLVideoElement | null>): VideoTimestampHook => {
  const [currentTime, setCurrentTime] = useState(0);

  // Update current time when video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', updateTime);
    return () => {
      video.removeEventListener('timeupdate', updateTime);
    };
  }, [videoRef]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const captureTimestamp = (): number => {
    const video = videoRef.current;
    if (video) {
      return video.currentTime;
    }
    return 0;
  };

  return {
    currentTime,
    formatTime,
    captureTimestamp
  };
};