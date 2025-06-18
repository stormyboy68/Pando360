"use client";
import { type FC } from "react";
import { number } from "zod/v4";
import { IUserServer } from "../UserServer/UserServerList";

interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  setPerPage: ( per_page: number ) => void;
  onPageChange?: (page: number, perPage: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  className,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  setPerPage,
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page, itemsPerPage);
    }
  };
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-black border rounded">
        <select
          className="block w-full leading-tight bg-white border border-gray-300 rounded focus:outline-none focus:ring-0 focus:border-blue-500"
          onChange={(e) => {
            setPerPage(Number(e.target.value));
          }}
        >
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="text-sm text-gray-700">
        نمایش {startItem} تا {endItem} از {totalItems} نتیجه
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`text-black px-3 py-1 rounded-md ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          قبلی
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`text-black cursor-pointer px-3 py-1 rounded-md ${
                currentPage === pageNum
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`text-black px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
          }`}
        >
          بعدی
        </button>
      </div>
    </div>
  );
};
