export interface PaginationUtilities {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

export interface PaginationParams {
    pageNumber: number;
    pageSize: number;
}

export interface PaginationHeader {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginationResult<T> {
    items: T[],
    pagination: PaginationUtilities
}