import React from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selectedPage: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-6">
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPages} // Total pages
        marginPagesDisplayed={2} // Number of page buttons before the first and after the last page
        pageRangeDisplayed={5} // Number of page buttons shown in the pagination
        onPageChange={onPageChange} // Method that runs when page is clicked
        forcePage={currentPage - 1} // Sync page state
        containerClassName="flex justify-center items-center space-x-2" // Flex container to align pagination items horizontally
        pageClassName="px-2 py-1  border-solid border-gray-300 rounded-md cursor-pointer" // Styles for page numbers
        activeClassName="bg-blue-600 text-white" // Active page styling
        disabledClassName="disabled:opacity-50 cursor-not-allowed" // Disabled button styles
        previousClassName="px-4 py-2 border border-solid border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-150 cursor-pointer" // Previous button styles
        nextClassName="px-4 py-2 border border-solid border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-150 cursor-pointer" // Next button styles
      />
    </div>
  );
};

export default Pagination;
