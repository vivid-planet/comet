import * as React from "react";
import { usePersistedState } from "./usePersistedState";

export enum SortDirection {
    ASC = "asc",
    DESC = "desc",
}
export interface ISortInformation {
    columnName: string;
    direction: SortDirection;
}
export interface ISortApi {
    current: ISortInformation;
    changeSort: (columnName: string) => void;
}
export function useTableQuerySort(
    defaultSort: ISortInformation,
    options: {
        persistedStateId?: string;
    } = {},
): ISortApi {
    const [sort, setSort] = usePersistedState<ISortInformation>(defaultSort, {
        persistedStateId: options.persistedStateId ? options.persistedStateId + "_sort" : undefined,
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
