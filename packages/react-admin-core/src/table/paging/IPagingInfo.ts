import * as React from "react";

export interface IPagingInfo {

    fetchNextPage?: () => void;
    fetchPreviousPage?: () => void;
    fetchFirstPage?: () => void;
    fetchLastPage?: () => void;
    fetchSpecificPage?: (page: number) => void;
    totalPages?: number | null;
    showTotalCount?: boolean;
    currentPage?: number;
    attachTableRef: (ref: React.RefObject<HTMLDivElement | undefined>) => void;
}
