import axios from "axios";
import type { Note } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface FetchNotesProps {
  query?: string,
  page?: number,
  perPage: number,
}

interface FetchNotesResponse {
  notes: Note[],
  totalPages: number,
}

export async function fetchNotes({ query, page, perPage }: FetchNotesProps): Promise<FetchNotesResponse> {
  const res = await api.get<FetchNotesResponse>("/docs", {
    params: { query, page, perPage },
  });

  return res.data;
}

export interface CreateNoteProps {
    title: string;
    content: string;
    tag: string;
}
    
export async function createNote(data: CreateNoteProps): Promise<Note> {
  const res = await api.post<Note>("/docs", data);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/docs/${id}`);
  return res.data;
}