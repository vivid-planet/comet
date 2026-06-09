import { usePersistedState } from "./usePersistedState";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}
/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface ISortInformation {
    columnName: string;
    direction: SortDirection;
}
/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface ISortApi {
    current: ISortInformation;
    changeSort: (columnName: string) => void;
}
/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export function useTableQuerySort(
    defaultSort: ISortInformation,
    options: {
        persistedStateId?: string;
    } = {},
): ISortApi {
    const [sort, setSort] = usePersistedState<ISortInformation>(defaultSort, {
        persistedStateId: options.persistedStateId ? `${options.persistedStateId}_sort` : undefined,
    });

    function changeSort(columnName: string) {
        let direction = SortDirection.ASC;

        if (sort && sort.columnName === columnName) {
            direction = sort.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
        }
        setSort({
            columnName,
            direction,
        });
    }

    return {
        current: sort,
        changeSort,
    };
}
