import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Clock, Trash2 } from "lucide-react";

interface Note {
  id: string;
  content: string;
  timestamp: number;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteListProps {
  notes: Note[];
  editingNoteId: string | null;
  editingContent: string;
  setEditingNoteId: (id: string | null) => void;
  setEditingContent: (content: string) => void;
  onUpdateNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  updateNoteIsPending: boolean;
  formatTime: (seconds: number) => string;
}

export function NoteList({
  notes,
  editingNoteId,
  editingContent,
  setEditingNoteId,
  setEditingContent,
  onUpdateNote,
  onDeleteNote,
  updateNoteIsPending,
  formatTime
}: NoteListProps) {
  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
      {notes.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No notes yet. Add your first note using the form above.
        </div>
      ) : (
        notes.map((note) => (
          <div 
            key={note.id} 
            className="border rounded-lg p-3 bg-background hover:bg-accent/50 transition-colors"
          >
            {editingNoteId === note.id ? (
              // Edit mode
              <div className="space-y-2">
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="resize-none"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => onUpdateNote(note.id)}
                    disabled={updateNoteIsPending || !editingContent.trim()}
                  >
                    {updateNoteIsPending ? (
                      <Save className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingNoteId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View mode
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(note.timestamp)}</span>
                      <span>•</span>
                      <span>{note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingNoteId(note.id);
                        setEditingContent(note.content);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteNote(note.id)}
                      className="h-7 w-7 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}