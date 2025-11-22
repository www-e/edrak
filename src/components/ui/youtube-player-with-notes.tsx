import { Button } from "@/components/ui/button";
import { YouTubePlayer as BaseYouTubePlayer } from "@/components/ui/youtube-player";
import { StickyNote, MessageCircle } from "lucide-react";

interface YouTubePlayerWithNotesProps {
  url: string;
  title: string;
  className?: string;
  onAddNote?: (timestamp: number) => void;
  onSendMessage?: () => void;
}

export function YouTubePlayerWithNotes({ 
  url, 
  title, 
  className, 
  onAddNote, 
  onSendMessage 
}: YouTubePlayerWithNotesProps) {
  return (
    <div className="relative">
      <BaseYouTubePlayer
        url={url}
        title={title}
        className={className}
      />
      {/* Controls overlay for note-taking and messaging */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {onAddNote && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onAddNote(0)} // For YouTube, we'll capture the current time via external mechanism
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