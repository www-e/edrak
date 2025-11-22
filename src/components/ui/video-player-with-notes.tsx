import { forwardRef, useImperativeHandle, useRef } from "react";
import { Button } from "@/components/ui/button";
import { VideoPlayer as BaseVideoPlayer, VideoPlayerHandle } from "@/components/ui/video-player";
import { StickyNote, MessageCircle } from "lucide-react";

interface VideoPlayerWithNotesProps {
  src: string;
  title?: string;
  className?: string;
  onAddNote?: (timestamp: number) => void;
  onSendMessage?: () => void;
}

export const VideoPlayerWithNotes = forwardRef<VideoPlayerHandle, VideoPlayerWithNotesProps>(
  ({ src, title, className, onAddNote, onSendMessage }, ref) => {
    const playerRef = useRef<VideoPlayerHandle>(null);
    
    // Expose only the video player methods we want
    useImperativeHandle(ref, () => ({
      getCurrentTime: () => playerRef.current?.getCurrentTime() || 0,
      getDuration: () => playerRef.current?.getDuration() || 0,
      formatTime: (seconds: number) => playerRef.current?.formatTime(seconds) || "0:00",
    }));

    return (
      <div className="relative">
        <BaseVideoPlayer
          src={src}
          title={title}
          className={className}
        />
        {/* Controls overlay for note-taking and messaging */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {onAddNote && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAddNote(playerRef.current?.getCurrentTime() || 0)}
              title="Add Note at Current Time"
              className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md transition-all"
            >
              <StickyNote className="w-4 h-4" />
            </Button>
          )}
          {onSendMessage && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onSendMessage}
              title="Message Professor"
              className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

VideoPlayerWithNotes.displayName = "VideoPlayerWithNotes";