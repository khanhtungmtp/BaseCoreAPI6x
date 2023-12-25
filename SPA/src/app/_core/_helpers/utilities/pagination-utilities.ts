export interface PaginationUtilities {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginationParams {
    pageNumber: number;
    pageSize: number;
}

export interface PaginationHeader {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginationResult<T> {
    result: T,
    pagination: PaginationUtilities
}