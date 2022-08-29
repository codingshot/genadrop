import React from "react";
import ReactPaginate from "react-paginate";
import classes from "./Pagination.module.css";
import { ReactComponent as AngleLeft } from "../../assets/icon-pagination-left.svg";
import { ReactComponent as AngleRight } from "../../assets/icon-pagination-right.svg";

const Pagination = ({ handleSetState, perPage = 8, pageNumber, filteredCollection, paginatePage }) => {
  const PageCount = (list = []) => {
    return list ? Math.ceil(list.length / perPage) : 1;
  };

  const changePage = ({ selected }) => {
    handleSetState({ pageNumber: selected });
  };

  return (
    <div className={classes.footer}>
      <ReactPaginate
        previousLabel={<AngleLeft />}
        nextLabel={<AngleRight />}
        breakLabel="..."
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={PageCount(filteredCollection)}
        onPageChange={changePage}
        forcePage={pageNumber}
        containerClassName={classes.pagination}
        previousLinkClassName={classes.pagePrev}
        nextLinkClassName={classes.pageNext}
        disabledClassName={classes.pageDisabled}
        activeClassName={classes.activePage}
        pageLinkClassName={classes.pageNumber}
      />
      <div className={classes.directPagination}>
        <p>Go to page</p>
        <input type="text" onChange={(e) => handleSetState({ paginatePage: e.target.value })} />
        <div
          onClick={() => {
            handleSetState({ pageNumber: paginatePage - 1 });
          }}
        >
          Go
          <AngleRight />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
