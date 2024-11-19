import { DataGridProps, GridFilterModel, GridSortDirection, GridSortModel } from "@mui/x-data-grid";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import queryString from "query-string";
import { useCallback } from "react";
import { useHistory, useLocation } from "react-router";

//returns props for DataGrid that turns it into a controlled component ready to be used for remote filter/sorting/paging
export function useDataGridRemote({
    queryParamsPrefix = "",
    pageSize: initialPageSize = 25,
    initialSort,
    initialFilter,
}: {
    queryParamsPrefix?: string;
    pageSize?: number;
    initialSort?: Array<{ field: string; sort: GridSortDirection }>;
    initialFilter?: GridFilterModel;
} = {}): Omit<DataGridProps, "rows" | "columns"> & { sortModel: GridSortModel } {
    const history = useHistory();
    const location = useLocation();

    const sortParamName = `${queryParamsPrefix}sort`;
    const filterParamName = `${queryParamsPrefix}filter`;
    const pageParamName = `${queryParamsPrefix}page`;
    const pageSizeParamName = `${queryParamsPrefix}pageSize`;

    const parsedSearch = queryString.parse(location.search, { parseNumbers: true });

    const page = (parsedSearch[pageParamName] as number) ?? 0;

    const pageSize = (parsedSearch[pageSizeParamName] as number) ?? initialPageSize;

    const onPaginationModelChange = useCallback(
        (model: GridPaginationModel, details: GridCallbackDetails) => {
            if (model.page) {
                history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [pageParamName]: model.page }) });
            }
            if (model.pageSize) {
                history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [pageSizeParamName]: model.pageSize }) });
            }
        },
        [history, location, pageParamName, pageSizeParamName, parsedSearch],
    );

    const sortModel =
        (!parsedSearch[sortParamName]
            ? undefined
            : !Array.isArray(parsedSearch[sortParamName])
            ? parsedSearch[sortParamName] === "none"
                ? []
                : [parsedSearch[sortParamName] as string]
            : (parsedSearch[sortParamName] as string[])
        )?.map((i) => {
            const parts = i.split(":");
            return {
                field: parts[0],
                sort: parts[1] as GridSortDirection,
            };
        }) ??
        initialSort ??
        [];

    const handleSortModelChange = useCallback(
        (sortModel: GridSortModel) => {
            const sort = sortModel.length > 0 ? sortModel.map((i) => `${i.field}:${i.sort}`) : ["none"];
            history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [sortParamName]: sort }) });
        },
        [history, location, parsedSearch, sortParamName],
    );

    const filterModel = parsedSearch[filterParamName] ? JSON.parse(parsedSearch[filterParamName] as string) : initialFilter ?? { items: [] };
    const handleFilterChange = useCallback(
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

        paginationModel: {
            pageSize,
            page,
        },
        onPaginationModelChange,

        pagination: true,
        sortingMode: "server",
        sortModel,
        onSortModelChange: handleSortModelChange,
    };
}
