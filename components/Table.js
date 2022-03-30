import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

const paginationButtonNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Table(props) {
  return (
    <div className=" mt-4 py-2 align-middle inline-block min-w-full ">
      <div className="shadow-lg ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {props.columns.map((item, index) => {
                if (item.renderHeader) {
                  return (
                    <th
                      key={index}
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-600 sm:pl-6"
                    >
                      {item.headerRender()}
                    </th>
                  );
                } else {
                  return (
                    <th
                      key={index}
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-600 sm:pl-6"
                    >
                      {item.title}
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white overflow-scroll">
            {props.dataSource.map((dataSource, index) => {
              return (
                <tr key={index} className={`duration-200 hover:bg-gray-100 `}>
                  {props.columns.map((column, index) => {
                    if (column.render) {
                      return (
                        <td
                          key={index}
                          className="sm:pl-6 pl-4 py-4 whitespace-nowrap"
                        >
                          {column.render(dataSource[column.dataIndex])}
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={index}
                          className="sm:pl-6 pl-4 py-4 whitespace-nowrap"
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
            })}
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
            <div className="w-full hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">10</span> of{" "}
                  <span className="font-medium">97</span> results
                </p>
              </div>
              <div>
                <nav
                  className=" z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    className=" inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                  {paginationButtonNums.map((item) => {
                    return (
                      <button
                        onClick={() => props.handlePaginationClick(item)}
                        key={item}
                        className="hover:bg-green-50 border-gray-300 hover:text-green-600 text-gray-500  inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        {item}
                      </button>
                    );
                  })}
                  <a
                    href="#"
                    className=" inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
