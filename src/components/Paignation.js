import { useState } from "react";
import { ArrowDown, ChevronDown, ChevronsDownIcon } from "lucide-react";

const Pagination = ({ pagination, setPagination, totalItems = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const limits = [5, 10, 20, 50];

    return (
        <div className="flex bg-white items-center justify-between p-4 relative">
            {/* Items per page selector */}
            <div className="flex items-center relative">
                <label htmlFor="entries" className="text-sm text-[#828282] mr-2">
                    Entries per page
                </label>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative bg-white border border-black rounded-[4px] px-4 py-1 text-sm text-left focus:outline-none flex items-center justify-between min-w-[80px]"
                >
                    <span className="text-primary">{pagination.limit}</span>
                    <ChevronDown className="w-4 h-4 ml-2 text-black" />
                </button>
                {isOpen && (
                    <ul className="absolute z-50  -top-[153px] mt-1 right-0 bg-white border border-gray-300 rounded shadow-md w-[120px]">
                        {limits.map((limit) => (
                            <li
                                key={limit}
                                onClick={() => {
                                    setPagination((prev) => ({
                                        ...prev,
                                        limit,
                                        page: 1,
                                        totalPages: Math.ceil(totalItems / limit) || 1,
                                    }));
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2 text-sm font-medium cursor-pointer hover:bg-primary hover:text-white ${
                                    pagination.limit === limit ? "text-white bg-primary font-semibold" : "text-gray-800"
                                }`}
                            >
                                {limit}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center">
                <button
                    className="px-3 py-1 text-sm text-[#828282] hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={pagination.page === 1}
                    onClick={() =>
                        setPagination((prev) => ({
                            ...prev,
                            page: Math.max(prev.page - 1, 1),
                        }))
                    }
                >
                    Previous
                </button>

                {Math.ceil(totalItems / pagination.limit) > 5 ? (
                    <>
                        <button
                            className={`px-3 py-1 border border-primary rounded-[10px] mx-1 ${pagination.page === 1 ? "bg-primary text-white" : "text-[#828282] hover:bg-primary hover:text-white"}`}
                            onClick={() => setPagination((prev) => ({ ...prev, page: 1 }))}
                        >
                            1
                        </button>
                        {pagination.page > 3 && <span className="px-2">...</span>}
                        {Array.from({ length: 5 }, (_, index) => {
                            const pageNumber = pagination.page - 2 + index;
                            const totalPages = Math.ceil(totalItems / pagination.limit);
                            if (pageNumber > 1 && pageNumber < totalPages) {
                                return (
                                    <button
                                        key={pageNumber}
                                        className={`px-3 py-1 border border-primary rounded-[10px] mx-1 ${pagination.page === pageNumber ? "bg-primary text-white" : "text-[#828282] hover:bg-primary hover:text-white"}`}
                                        onClick={() => setPagination((prev) => ({ ...prev, page: pageNumber }))}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            }
                            return null;
                        })}
                        {pagination.page < Math.ceil(totalItems / pagination.limit) - 2 && <span className="px-2">...</span>}
                        <button
                            className={`px-3 py-1 border border-primary rounded-[10px] mx-1 ${pagination.page === Math.ceil(totalItems / pagination.limit) ? "bg-primary text-white" : "text-[#828282] hover:bg-primary hover:text-white"}`}
                            onClick={() => setPagination((prev) => ({ ...prev, page: Math.ceil(totalItems / pagination.limit) }))}
                        >
                            {Math.ceil(totalItems / pagination.limit)}
                        </button>
                    </>
                ) : (
                    Array.from({ length: Math.ceil(totalItems / pagination.limit) }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`px-3 py-1 border border-primary rounded-[10px] mx-1 ${pagination.page === index + 1 ? "bg-primary text-white" : "text-[#828282] hover:bg-primary hover:text-white"}`}
                            onClick={() => setPagination((prev) => ({ ...prev, page: index + 1 }))}
                        >
                            {index + 1}
                        </button>
                    ))
                )}

                <button
                    className="px-3 py-1 text-sm text-[#828282] hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={pagination.page >= Math.ceil(totalItems / pagination.limit)}
                    onClick={() =>
                        setPagination((prev) => ({
                            ...prev,
                            page: Math.min(prev.page + 1, Math.ceil(totalItems / pagination.limit)),
                        }))
                    }
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
