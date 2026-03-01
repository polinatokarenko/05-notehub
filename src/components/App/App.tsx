import css from "./App.module.css";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";
import type { tagType } from "../../services/noteService";
import { deleteNote } from "../../services/noteService";
import { useDebouncedCallback } from "use-debounce";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function App() {
  const [page, setPage] = useState<number>(1);
  const perPage: number = 6;

  const [search, setSearch] = useState<string>("");

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [tag, setTag] = useState<tagType>('Todo');

  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", search, tag, page, perPage],
    queryFn: () => fetchNotes({ search, tag, page, perPage }),
    initialData: { notes: [], totalPages: 0 },
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCloseModal = () => setIsModalVisible(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  }

  const debouncedSearch = useDebouncedCallback((value) => {
    setSearch(value)
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {data?.totalPages > 1 && <Pagination page={page} setPage={setPage} totalPages={data.totalPages} />}
        <button className={css.button} onClick={() => setIsModalVisible(true)}>
          Create note +
        </button>
        {isModalVisible && (
          <Modal onClose={handleCloseModal}>
            <NoteForm onClose={handleCloseModal} setTag={() => setTag} />
          </Modal>
        )}
      </header>
      
      <NoteList notes={data?.notes ?? []} onDelete={(id) => deleteMutation.mutate(id)} isDeleting={deleteMutation.isPending}/>
    </div>
  );
}