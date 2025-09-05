import { Link } from "react-router-dom";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

const Pagination = ({ currentPage, maxPerPage, count, onPageChange }) => {
  const from = (currentPage - 1) * maxPerPage + 1;
  const to = Math.min(currentPage * maxPerPage, count);
  const maxPage = Math.floor(count / maxPerPage + 1);

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <span
          onClick={
            currentPage > 1 ? () => onPageChange(currentPage - 1) : () => {}
          }
          className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-black/10 cursor-pointer"
        >
          Précédente
        </span>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-black/10 cursor-pointer"
        >
          Suivante
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{from}</span> à{" "}
            <span className="font-medium">{to}</span> sur{" "}
            <span className="font-medium">{count}</span>
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md"
          >
            <button
              disabled={currentPage === 1}
              onClick={currentPage > 1 ? () => onPageChange(1) : () => {}}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-black/5 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Première page</span>
              <ChevronDoubleLeftIcon aria-hidden="true" className="size-5" />
            </button>
            <button
              disabled={currentPage === 1}
              onClick={
                currentPage > 1 ? () => onPageChange(currentPage - 1) : () => {}
              }
              className="relative inline-flex items-center px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-black/5 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Précédente</span>
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </button>
            <span className="relative hidden items-center px-4 py-2 text-sm font-semibold text-red-500 inset-ring inset-ring-gray-700 md:inline-flex">
              {currentPage}
            </span>
            <button
              disabled={currentPage >= maxPage}
              onClick={
                currentPage < maxPage
                  ? () => onPageChange(Number(currentPage) + 1)
                  : () => {}
              }
              className="relative inline-flex items-center px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-black/5 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Suivante</span>
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </button>
            <button
              disabled={currentPage >= maxPage}
              onClick={
                currentPage < maxPage ? () => onPageChange(maxPage) : () => {}
              }
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-black/5 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Dernière page</span>
              <ChevronDoubleRightIcon aria-hidden="true" className="size-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
