import { DataGridProProps, GridFilterModel, GridSortDirection, GridSortModel, GridToolbar } from "@mui/x-data-grid-pro";
import queryString from "query-string";
import * as React from "react";
import { useHistory, useLocation } from "react-router";

//returns props for DataGrid that turns it into a controlled component ready to be used for remote filter/sorting/paging
export function useDataGridRemote({
    queryParamsPrefix = "",
}: {
    queryParamsPrefix?: string;
} = {}): Omit<DataGridProProps, "rows" | "columns"> & { page: number; pageSize: number } {
    const history = useHistory();
    const location = useLocation();

    const sortParamName = `${queryParamsPrefix}sort`;
    const filterParamName = `${queryParamsPrefix}filter`;
    const pageParamName = `${queryParamsPrefix}page`;
    const pageSizeParamName = `${queryParamsPrefix}pageSize`;

    const parsedSearch = queryString.parse(location.search, { parseNumbers: true });
    // TODO configurable search prefix (to support multiple grid on one page)

    const page = (parsedSearch[pageParamName] as number) ?? 0;
    const handlePageChange = (newPage: number) => {
        history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [pageParamName]: newPage }) });
    };

    const pageSize = (parsedSearch[pageSizeParamName] as number) ?? 20;
    const handlePageSizeChange = (newPageSize: number) => {
        history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [pageSizeParamName]: newPageSize }) });
    };

    const sortModel = (
        !parsedSearch.sort
            ? []
            : !Array.isArray(parsedSearch[sortParamName])
            ? [parsedSearch[sortParamName] as string]
            : (parsedSearch[sortParamName] as string[])
    ).map((i) => {
        const parts = i.split(":");
        return {
            field: parts[0],
            sort: parts[1] as GridSortDirection,
        };
    });
    const handleSortModelChange = React.useCallback(
        (sortModel: GridSortModel) => {
            const sort = sortModel.map((i) => `${i.field}:${i.sort}`);
            history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [sortParamName]: sort }) });
        },
        [history, location, parsedSearch, sortParamName],
    );

    const filterModel = parsedSearch.filter ? JSON.parse(parsedSearch[filterParamName] as string) : { items: [] };
    const handleFilterChange = React.useCallback(
        (filterModel: GridFilterModel) => {
            history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [filterParamName]: JSON.stringify(filterModel) }) });
        },
        [history, location, parsedSearch, filterParamName],
    );

    return {
        filterMode: "server",
        filterModel: filterModel,
        onFilterModelChange: handleFilterChange,

        paginationMode: "server",
        page,
        pageSize,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,

        sortingMode: "server",
        sortModel,
        onSortModelChange: handleSortModelChange,

        components: { Toolbar: GridToolbar },
        componentsProps: {
            toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
            },
        },
        pagination: true,
    };
}
