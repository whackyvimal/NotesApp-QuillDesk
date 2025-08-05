import { useState } from "react";
import { Note } from "@/types/note";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pin, Archive, Trash2, MoreVertical, Edit, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditNoteDialog } from "./EditNoteDialog";

interface NoteCardProps {
  note: Note;
  onPin: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string, permanent?: boolean) => void;
  onRestore: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export const NoteCard = ({ note, onPin, onArchive, onDelete, onRestore, onUpdate }: NoteCardProps) => {
  const [showEdit, setShowEdit] = useState(false);

  const getStatusColor = () => {
    switch (note.status) {
      case "pinned":
        return "border-note-pinned shadow-pinned bg-gradient-to-br from-white to-yellow-50";
      case "archived":
        return "border-note-archived bg-gradient-to-br from-white to-blue-50";
      case "trash":
        return "border-note-trash bg-gradient-to-br from-white to-red-50 opacity-75";
      default:
        return "border-border hover:border-primary/50 bg-gradient-to-br from-white to-gray-50/50";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <Card className={cn(
        "transition-all duration-300 hover:shadow-hover transform hover:-translate-y-1 border-2",
        getStatusColor()
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 flex-1 mr-2">
              {note.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              {note.status === "pinned" && (
                <Pin className="h-4 w-4 text-note-pinned fill-current" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {note.status === "trash" ? (
                    <>
                      <DropdownMenuItem onClick={() => onRestore(note.id)}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restore
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(note.id, true)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Forever
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => setShowEdit(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPin(note.id)}>
                        <Pin className="h-4 w-4 mr-2" />
                        {note.status === "pinned" ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onArchive(note.id)}>
                        <Archive className="h-4 w-4 mr-2" />
                        {note.status === "archived" ? "Unarchive" : "Archive"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(note.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Move to Trash
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
            {note.content || "No content"}
          </p>
          
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 text-xs text-muted-foreground">
          <div className="flex justify-between items-center w-full">
            <span>Created {formatDate(note.createdAt)}</span>
            {note.updatedAt.getTime() !== note.createdAt.getTime() && (
              <span>Updated {formatDate(note.updatedAt)}</span>
            )}
          </div>
        </CardFooter>
      </Card>

      <EditNoteDialog
        note={note}
        open={showEdit}
        onOpenChange={setShowEdit}
        onUpdateNote={onUpdate}
      />
    </>
  );
};