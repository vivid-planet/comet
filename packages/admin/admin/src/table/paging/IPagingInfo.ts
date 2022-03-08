import * as React from "react";

export interface IPagingInfo {
    fetchNextPage?: () => void;
    fetchPreviousPage?: () => void;
    totalPages?: number | null;
    currentPage?: number;
    attachTableRef: (ref: React.RefObject<HTMLDivElement | undefined>) => void;
}
