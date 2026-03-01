/*css*/
import css from "./NoteList.module.css";

/*hooks*/
import { useMutation, useQueryClient } from "@tanstack/react-query";

/*types*/
import type { Note } from "../../types/note";

/*services*/
import { deleteNote } from "../../services/noteService";

interface NoteListProps {
  notes: Note[],
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });


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
                onClick={() => deleteMutation.mutate(note.id)}
                disabled={deleteMutation.isPending}
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