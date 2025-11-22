import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, X } from "lucide-react";

interface NoteComposerProps {
  newNoteContent: string;
  setNewNoteContent: (content: string) => void;
  currentTimestamp: number;
  onAddNote: () => void;
  onCancel: () => void;
  isPending: boolean;
  formatTime: (seconds: number) => string;
}

export function NoteComposer({
  newNoteContent,
  setNewNoteContent,
  currentTimestamp,
  onAddNote,
  onCancel,
  isPending,
  formatTime
}: NoteComposerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Add New Note</h3>
        <Badge variant="outline" className="text-xs">
          Time: {formatTime(currentTimestamp)}
        </Badge>
      </div>
      
      <div className="flex gap-2">
        <Textarea
          placeholder="Write your note here..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="resize-none min-h-[80px]"
          disabled={isPending}
        />
        <div className="flex flex-col gap-2">
          <Button 
            size="sm" 
            onClick={onAddNote}
            disabled={isPending || !newNoteContent.trim()}
            className="h-8"
          >
            {isPending ? (
              <Save className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onCancel}
            className="h-8"
            disabled={isPending}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => setNewNoteContent("")}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Clear Note
      </Button>
    </div>
  );
}