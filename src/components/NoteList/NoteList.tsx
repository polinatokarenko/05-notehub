import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import css from "./NoteList.module.css";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";

interface NoteListProps {
  page: number;
  perPage: number;
  setTotalPages: (totalPages: number) => void;
  search?: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function NoteList({ page, perPage, setTotalPages, search }: NoteListProps) {
  const queryClient = useQueryClient();

  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, perPage, search],
    queryFn: () => fetchNotes({ page, perPage, query: search }),
    initialData: { notes: [], totalPages: 0 },
  });

  useEffect(() => {
    setTotalPages(data.totalPages);
  }, [data.totalPages, setTotalPages]);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const notes = Array.isArray(data?.notes) ? data.notes : [];

  return (
    <ul className={css.list}>
      {notes.length > 0 ? (
        notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <button
                className={css.button}
                onClick={() => mutate(note.id)}
                disabled={isPending}
              >
                Delete
              </button>
            </div>
          </li>
        ))
      ) : (
        <li className={css.listItem}>No notes found</li>
      )}
    </ul>
  );
}