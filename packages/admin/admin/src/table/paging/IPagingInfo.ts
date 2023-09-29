import * as React from "react";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface IPagingInfo {
    fetchNextPage?: () => void;
    fetchPreviousPage?: () => void;
    totalPages?: number | null;
    currentPage?: number;
    attachTableRef: (ref: React.RefObject<HTMLDivElement | undefined>) => void;
}
