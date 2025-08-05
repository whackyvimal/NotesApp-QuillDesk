import { useNotes } from "@/hooks/useNotes";
import { CreateNoteDialog } from "@/components/CreateNoteDialog";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { NoteCard } from "@/components/NoteCard";
import { NoteFilter } from "@/types/note";

const NotesPage = () => {
  const {
    notes,
    allNotes,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    activeFilter,
    setActiveFilter,
    createNote,
    updateNote,
    deleteNote,
    pinNote,
    archiveNote,
    restoreNote,
    getAllTags,
  } = useNotes();

  const getNoteCounts = (): Record<NoteFilter, number> => {
    return {
      all: allNotes.filter(note => note.status === "active" || note.status === "pinned").length,
      pinned: allNotes.filter(note => note.status === "pinned").length,
      archived: allNotes.filter(note => note.status === "archived").length,
      trash: allNotes.filter(note => note.status === "trash").length,
    };
  };

  const getEmptyStateMessage = () => {
    if (activeFilter === "trash") {
      return {
        title: "No notes in trash",
        description: "Deleted notes will appear here. You can restore them or delete permanently.",
        emoji: "🗑️"
      };
    }
    if (activeFilter === "archived") {
      return {
        title: "No archived notes",
        description: "Archive notes to organize them without cluttering your main view.",
        emoji: "📦"
      };
    }
    if (activeFilter === "pinned") {
      return {
        title: "No pinned notes",
        description: "Pin important notes to keep them at the top of your list.",
        emoji: "📌"
      };
    }
    if (searchQuery || selectedTags.length > 0) {
      return {
        title: "No notes found",
        description: "Try adjusting your search or filter criteria.",
        emoji: "🔍"
      };
    }
    return {
      title: "No notes yet",
      description: "Create your first note to get started organizing your thoughts!",
      emoji: "✨"
    };
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            My Notes
          </h1>
          <p className="text-muted-foreground text-lg">
            Organize your thoughts with style
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 mr-4">
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              availableTags={getAllTags()}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              noteCounts={getNoteCounts()}
            />
          </div>
          <CreateNoteDialog onCreateNote={createNote} />
        </div>

        {/* Notes Grid */}
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={pinNote}
                onArchive={archiveNote}
                onDelete={deleteNote}
                onRestore={restoreNote}
                onUpdate={updateNote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{emptyState.emoji}</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {emptyState.title}
            </h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {emptyState.description}
            </p>
            {activeFilter === "all" && !searchQuery && selectedTags.length === 0 && (
              <div className="mt-6">
                <CreateNoteDialog onCreateNote={createNote} />
              </div>
            )}
          </div>
        )}

        {/* Footer Stats */}
        {allNotes.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
              <span className="text-sm text-muted-foreground">
                Total Notes: <span className="font-semibold text-foreground">{allNotes.length}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                Tags: <span className="font-semibold text-foreground">{getAllTags().length}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;