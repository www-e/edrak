import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  StickyNote
} from "lucide-react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { NoteComposer } from "./note-composer";
import { NoteList } from "./note-list";
import { PaginationControls } from "./pagination-controls";

interface NoteTakingPanelProps {
  courseId: string;
  lessonId: string;
  currentTimestamp?: number; // Current video timestamp to auto-fill when adding notes
  className?: string;
}

interface Note {
  id: string;
  content: string;
  timestamp: number;
  createdAt: Date;
  updatedAt: Date;
}


export function NoteTakingPanel({
  courseId,
  lessonId,
  currentTimestamp = 0,
  className = ""
}: NoteTakingPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // Fixed limit for now

  const { toast } = useToast();

  // TRPC mutations
  const { data: notesData, refetch, isLoading } = api.student.notes.getByLesson.useQuery(
    { courseId, lessonId, page, limit },
    { enabled: !!courseId && !!lessonId }
  );

  const createNote = api.student.notes.create.useMutation();
  const updateNote = api.student.notes.update.useMutation();
  const deleteNote = api.student.notes.delete.useMutation();

  // Update local notes when data changes
  useEffect(() => {
    if (notesData) {
      setNotes(notesData.notes.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      })));
    }
  }, [notesData]);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      toast({
        title: "Note content is required",
        description: "Please enter some text for your note",
        variant: "destructive",
      });
      return;
    }

    try {
      await createNote.mutateAsync({
        lessonId,
        courseId,
        content: newNoteContent,
        timestamp: currentTimestamp,
      });

      setNewNoteContent("");
      await refetch();

      toast({
        title: "Note added successfully",
        description: `Note added at ${formatTime(currentTimestamp)}`,
      });
    } catch (error) {
      toast({
        title: "Error adding note",
        description: "Failed to add your note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editingContent.trim()) {
      toast({
        title: "Note content is required",
        description: "Please enter some text for your note",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateNote.mutateAsync({
        noteId,
        content: editingContent,
      });

      setEditingNoteId(null);
      await refetch();

      toast({
        title: "Note updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating note",
        description: "Failed to update your note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote.mutateAsync({
        noteId,
      });

      await refetch();

      toast({
        title: "Note deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting note",
        description: "Failed to delete your note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={className}>
      <CardHeader
        className="cursor-pointer p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Course Notes
            </CardTitle>
            <Badge variant="secondary">{notes.length} notes</Badge>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4 space-y-4">
          {/* Note composer */}
          <NoteComposer
            newNoteContent={newNoteContent}
            setNewNoteContent={setNewNoteContent}
            currentTimestamp={currentTimestamp}
            onAddNote={handleAddNote}
            onCancel={() => setNewNoteContent("")}
            isPending={createNote.isPending}
            formatTime={formatTime}
          />

          {/* Notes list */}
          {isLoading ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Loading notes...
            </div>
          ) : (
            <NoteList
              notes={notes}
              editingNoteId={editingNoteId}
              editingContent={editingContent}
              setEditingNoteId={setEditingNoteId}
              setEditingContent={setEditingContent}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              updateNoteIsPending={updateNote.isPending}
              formatTime={formatTime}
            />
          )}

          {/* Pagination controls */}
          {notesData && (
            <PaginationControls
              currentPage={notesData.page}
              totalPages={notesData.totalPages}
              total={notesData.total}
              limit={notesData.limit}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}