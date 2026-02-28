import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void,
    totalPages: number;
}

export default function Pagination({ page, setPage, totalPages, }: PaginationProps) {
  if (totalPages >= 1) {
    return (
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
      />
    );
  } else { return null };
}