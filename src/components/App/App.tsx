/*css*/
import css from "./App.module.css";

/*hooks*/
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

/*components*/
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";

/*services*/
import { fetchNotes } from "../../services/noteService";

/*types*/
import type { Note } from "../../types/note";

/*message*/
import toast, { Toaster } from 'react-hot-toast';


interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function App() {
  const [page, setPage] = useState<number>(1);
  const perPage: number = 6;

  const [search, setSearch] = useState<string>("");

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { data, isSuccess, isError, isLoading } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes({ search, page, perPage}),
    initialData: { notes: [], totalPages: 0 },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
  if (isSuccess && data.notes.length === 0 && search.length > 0 ) {
    toast.error('No notes were found :(', {
      style: { fontFamily: 'Montserrat' },
    });
    }
  }, [isSuccess, data.notes.length, search.length]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  }

  const debouncedSearch = useDebouncedCallback((value) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <div className={css.app}>
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {data.totalPages > 1 && <Pagination page={page} setPage={setPage} totalPages={data.totalPages} />}
        <button className={css.button} onClick={() => setIsModalVisible(true)}>
          Create note +
        </button>
        {isModalVisible && (
          <Modal onClose={handleCloseModal}>
            <NoteForm onClose={handleCloseModal} />
          </Modal>
        )}
      </header>
      
      {data?.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}