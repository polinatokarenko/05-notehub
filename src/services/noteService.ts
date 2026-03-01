/*api*/
import axios from "axios";

/*types*/
import type { Note } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export type tagType = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface FetchNotesProps {
  search?: string,
  tag?: tagType,
  sortBy?: string,
  page?: number,
  perPage?: number,
}

interface FetchNotesResponse {
  notes: Note[],
  totalPages: number,
}

export async function fetchNotes({ search, tag, sortBy, page, perPage }: FetchNotesProps): Promise<FetchNotesResponse> {
  const res = await api.get<FetchNotesResponse>("/notes", {
    params: { search, tag, sortBy, page, perPage },
  });

  return res.data;
}

export interface CreateNoteProps {
    title: string;
    content: string;
    tag: string;
}
    
export async function createNote(data: CreateNoteProps): Promise<Note> {
  const res = await api.post<Note>("/notes", data);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}