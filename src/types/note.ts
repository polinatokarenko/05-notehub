export interface Note {
  id: string;
  title: string;
  content: string | null;
  tag: string;
  createdAt: string;
  updatedAt: string;
}