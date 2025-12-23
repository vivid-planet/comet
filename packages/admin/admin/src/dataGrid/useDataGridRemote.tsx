import { type DataGridProps, type GridFilterModel, type GridSortDirection, type GridSortModel } from "@mui/x-data-grid";
import { type GridCallbackDetails } from "@mui/x-data-grid/models/api";
import { type GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import queryString from "query-string";
import { useCallback, useState } from "react";
import { useHistory, useLocation } from "react-router";

type UseDataGridRemoteReturnValue = {
    filterMode: DataGridProps["filterMode"];
    filterModel: DataGridProps["filterModel"];
    onFilterModelChange: DataGridProps["onFilterModelChange"];

    paginationMode: DataGridProps["paginationMode"];

    paginationModel: NonNullable<DataGridProps["paginationModel"]>;
    onPaginationModelChange: DataGridProps["onPaginationModelChange"];

    pagination: DataGridProps["pagination"];
    sortingMode: NonNullable<DataGridProps["sortingMode"]>;
    sortModel: NonNullable<DataGridProps["sortModel"]>;
    onSortModelChange: DataGridProps["onSortModelChange"];
};

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
} = {}): UseDataGridRemoteReturnValue {
    const history = useHistory();
    const location = useLocation();

    // fallback states are used when query param in the Url is lost (e.g. when the user open an EditDialog that creates a new sub route)
    const [fallbackSort, setFallbackSort] = useState<GridSortModel | undefined>(undefined);
    const [fallbackFilter, setFallbackFilter] = useState<GridFilterModel | undefined>(undefined);
    const [fallbackPage, setFallbackPage] = useState<number | undefined>(undefined);
    const [fallbackPageSize, setFallbackPageSize] = useState<number | undefined>(undefined);

    const sortParamName = `${queryParamsPrefix}sort`;
    const filterParamName = `${queryParamsPrefix}filter`;
    const pageParamName = `${queryParamsPrefix}page`;
    const pageSizeParamName = `${queryParamsPrefix}pageSize`;

    const parsedSearch = queryString.parse(location.search, { parseNumbers: true });

    const page = (parsedSearch[pageParamName] as number) ?? fallbackPage ?? 0;

    const pageSize = (parsedSearch[pageSizeParamName] as number) ?? fallbackPageSize ?? initialPageSize;

    const onPaginationModelChange = useCallback(
        (model: GridPaginationModel, details: GridCallbackDetails) => {
            history.replace({
                ...location,
                search: queryString.stringify({ ...parsedSearch, [pageParamName]: model.page, [pageSizeParamName]: model.pageSize }),
            });
            setFallbackPage(model.page);
            setFallbackPageSize(model.pageSize);
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
        fallbackSort ??
        initialSort ??
        [];

    const handleSortModelChange = useCallback(
        (sortModel: GridSortModel) => {
            const sort = sortModel.length > 0 ? sortModel.map((i) => `${i.field}:${i.sort}`) : ["none"];
            history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [sortParamName]: sort }) });
            setFallbackSort(sortModel);
        },
        [history, location, parsedSearch, sortParamName],
    );

    const filterModel = parsedSearch[filterParamName]
        ? JSON.parse(parsedSearch[filterParamName] as string)
        : (fallbackFilter ?? initialFilter ?? { items: [] });
    const handleFilterChange = useCallback(
        (filterModel: GridFilterModel) => {
            history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [filterParamName]: JSON.stringify(filterModel) }) });
            setFallbackFilter(filterModel);
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
