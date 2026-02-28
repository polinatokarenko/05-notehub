import css from "./App.module.css";
import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";

export default function App() {
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState(""); // значення для пошуку
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={(val) => setSearch(val)} />
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        <button className={css.button} onClick={() => setIsModalVisible(true)}>
          Create note +
        </button>
        {isModalVisible && (
          <Modal onClose={handleCloseModal}>
            <NoteForm />
          </Modal>
        )}
      </header>
      
      <NoteList
        page={page}
        perPage={perPage}
        setTotalPages={setTotalPages}
        search={search}
      />
    </div>
  );
}