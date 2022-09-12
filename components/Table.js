import Pagination from "./Pagination";
import { RefreshIcon } from "@heroicons/react/outline";
// const paginationButtonNums = [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
//   23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
// ];

export default function Table(props) {
  const handlePaginationClick = (data) => {
    // console.log("On Page Change Called");
    props.onPaginationApi(data.currentPage);
  };

  return (
    <div className="flex flex-col mt-4 py-2 align-middle inline-block min-w-full ">
      <div className="shadow-lg ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 ">
          <thead className="bg-gray-50">
            <tr>
              {props.columns.map((item, index) => {
                if (item.renderHeader) {
                  return (
                    <th
                      key={index}
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      {item.headerRender()}
                    </th>
                  );
                } else {
                  return (
                    <th
                      key={index}
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      {item.title}
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white overflow-scroll w-full">
            {props.dataLoading ? (
              <RefreshIcon className="text-green-300 animate-spin h-12 w-12 mx-auto" />
            ) : (
              props.dataSource.map((dataSource, index) => {
                return (
                  <tr key={index} className={`duration-200 hover:bg-gray-100`}>
                    {props.columns.map((column, index) => {
                      if (column.render) {
                        return (
                          <td
                            key={index}
                            className="pl-2 py-4 whitespace-nowrap"
                          >
                            {column.render(dataSource[column.dataIndex])}
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={index}
                            className="pl-2 py-4 whitespace-nowrap"
                          >
                            <div className="flex text-left">
                              <div className="text-sm font-medium text-gray-900">
                                {dataSource[column.dataIndex]}
                              </div>
                            </div>
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {props.pagination && (
          <div className=" bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="flex flex-row py-4">
              <Pagination
                currentPagePagination={props.currentPagePagination}
                totalRecords={props.totalRecords}
                pageLimit={100}
                pageNeighbours={4}
                onPageChanged={(data) => handlePaginationClick(data)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
