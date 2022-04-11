import React, { Component, Fragment, useState, useEffect } from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/outline";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

const Pagination = (props) => {
  const [currentPage, setCurrentPage] = useState(
    props.currentPagePagination || 1
  );
  const [totalRecords, setTotalRecords] = useState(Number(props.totalRecords));
  const [pageLimit, setPageLimit] = useState(props.pageLimit);
  const [pageNeighbours, setPageNeighbours] = useState(props.pageNeighbours);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalRecords / pageLimit)
  );

  const [pages, setPages] = useState([]);

  // constructor(props) {
  //   super(props);
  //   const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = props;

  //   this.pageLimit = typeof pageLimit === "number" ? pageLimit : 30;
  //   this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;

  //   this.pageNeighbours =
  //     typeof pageNeighbours === "number"
  //       ? Math.max(0, Math.min(pageNeighbours, 2))
  //       : 0;

  //   this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);

  //   this.state = { currentPage: 1 };
  // }

  useEffect(() => {
    setCurrentPage(props.currentPagePagination);
    setTotalRecords(Number(props.totalRecords));
    setTotalPages(Math.ceil(Number(props.totalRecords) / pageLimit));
  }, [props.totalRecords, props.currentPagePagination]);

  useEffect(() => {
    const pages = fetchPageNumbers();

    setPages(pages);
    // gotoPage(1);
  }, [currentPage, totalPages]);

  const gotoPage = (page) => {
    const { onPageChanged = (f) => f } = props;

    // const currentPage = Math.max(0, Math.min(page, totalPages));
    const currentPage = page;

    const paginationData = {
      currentPage,
      totalPages: totalPages,
      pageLimit: pageLimit,
      totalRecords: totalRecords,
    };

    setCurrentPage(currentPage);
    onPageChanged(paginationData);
  };

  const handleClick = (page, evt) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage + pageNeighbours * 2 + 1);
  };

  const fetchPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  if (!totalRecords) return null;

  if (totalPages === 1) return null;

  return (
    <Fragment>
      <div className="bg-white px-4 py-3 flex items-center justify-between sm:px-6">
        <nav aria-label="Countries Pagination">
          <ul className="relative z-0 inline-flex rounded-md shadow-sm">
            {pages.map((page, index) => {
              if (page === LEFT_PAGE)
                return (
                  <li key={index}>
                    <a
                      className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      href="#"
                      aria-label="Previous"
                      onClick={handleMoveLeft}
                    >
                      <ChevronDoubleLeftIcon
                        className="h-5 w-5 text-gray-800"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                );

              if (page === RIGHT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm"
                      href="#"
                      aria-label="Next"
                      onClick={handleMoveRight}
                    >
                      <ChevronDoubleRightIcon
                        className="h-5 w-5 text-gray-800"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                );

              return (
                <li key={index}>
                  <a
                    className={`bg-white ${
                      currentPage == page
                        ? "border-green-400 bg-green-100"
                        : "border-gray-300 hover:bg-gray-100"
                    } text-gray-500  relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                    href="#"
                    onClick={(e) => handleClick(page, e)}
                  >
                    {page}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default Pagination;
