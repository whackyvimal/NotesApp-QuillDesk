import { useState, useEffect } from "react";
import { Note, NoteFilter } from "@/types/note";
import { loadNotes, saveNotes, generateNoteId } from "@/utils/localStorage";
import { createSampleNotes } from "@/utils/sampleData";
import { useToast } from "@/hooks/use-toast";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<NoteFilter>("all");
  const { toast } = useToast();

  useEffect(() => {
    const loadedNotes = loadNotes();
    if (loadedNotes.length === 0) {
      // If no notes exist, create sample data
      const sampleNotes = createSampleNotes();
      setNotes(sampleNotes);
    } else {
      setNotes(loadedNotes);
    }
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const createNote = (title: string, content: string, tags: string[] = []) => {
    const newNote: Note = {
      id: generateNoteId(),
      title,
      content,
      tags,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [newNote, ...prev]);
    toast({
      title: "Note created",
      description: "Your note has been saved successfully.",
    });
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
    toast({
      title: "Note updated",
      description: "Your changes have been saved.",
    });
  };

  const deleteNote = (id: string, permanent = false) => {
    if (permanent) {
      setNotes(prev => prev.filter(note => note.id !== id));
      toast({
        title: "Note deleted permanently",
        description: "The note has been removed forever.",
        variant: "destructive",
      });
    } else {
      updateNote(id, { status: "trash" });
      toast({
        title: "Note moved to trash",
        description: "You can restore it from the trash.",
      });
    }
  };

  const pinNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    const newStatus = note?.status === "pinned" ? "active" : "pinned";
    updateNote(id, { status: newStatus });
  };

  const archiveNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    const newStatus = note?.status === "archived" ? "active" : "archived";
    updateNote(id, { status: newStatus });
  };

  const restoreNote = (id: string) => {
    updateNote(id, { status: "active" });
  };

  const getAllTags = (): string[] => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  };

  const getFilteredNotes = (): Note[] => {
    let filtered = notes;

    // Filter by status
    switch (activeFilter) {
      case "pinned":
        filtered = filtered.filter(note => note.status === "pinned");
        break;
      case "archived":
        filtered = filtered.filter(note => note.status === "archived");
        break;
      case "trash":
        filtered = filtered.filter(note => note.status === "trash");
        break;
      default:
        filtered = filtered.filter(note => note.status === "active" || note.status === "pinned");
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    // Sort: pinned first, then by update date
    return filtered.sort((a, b) => {
      if (a.status === "pinned" && b.status !== "pinned") return -1;
      if (b.status === "pinned" && a.status !== "pinned") return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  return {
    notes: getFilteredNotes(),
    allNotes: notes,
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
  };
};