import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    const { theme } = useTheme();
    return (
        <div className="flex items-center justify-center mt-8">
            <ul className="flex space-x-2">
                {pageNumbers.map((pageNumber) => (
                    <li
                        key={pageNumber}
                        style={{backgroundColor: pageNumber === currentPage ? theme.primaryColor:null}}
                        className={`rounded-md ${pageNumber === currentPage
                                ? 'text-white'
                                : 'text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <a
                            href="#"
                            className="block px-4 py-2"
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Pagination;
