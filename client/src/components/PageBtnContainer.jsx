import { useAppContext } from "../context/appContext";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";

export default function PageBtnContainer() {
  const { numberOfPages, page, changePage } = useAppContext();

//   Prev Page
  function prevPage() {
    let newPage = page - 1;
    if (newPage < 1) {
      newPage = numberOfPages;
    }
    changePage(newPage);
  }

//   Next Page
  function nextPage() {
    let newPage = page + 1;
    if (newPage > numberOfPages) {
      newPage = 1;
    }
    changePage(newPage);
  }

  const pages = Array.from({ length: numberOfPages }, (_, index) => {
    return index + 1;
  });

  return (
    <Wrapper>
      <button className="prev-btn" onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {pages.map((pageNumber) => {
          return (
            <button
              type="button"
              className={pageNumber === page ? "pageBtn active" : "pageBtn"}
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      <button className="next-btn" onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
}
