export interface IPagingInfo {
    fetchNextPage?: () => void;
    fetchPreviousPage?: () => void;
    totalPages?: number;
    currentPage?: number;
}
