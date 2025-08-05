export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  status: 'active' | 'pinned' | 'archived' | 'trash';
  createdAt: Date;
  updatedAt: Date;
}

export type NoteFilter = 'all' | 'pinned' | 'archived' | 'trash';