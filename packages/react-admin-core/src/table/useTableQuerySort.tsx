import * as React from "react";

export enum SortDirection {
    ASC = "asc",
    DESC = "desc",
}
export interface ISortInformation {
    field: string;
    direction: SortDirection;
}
export interface ISortApi {
    current: ISortInformation;
    changeSort: (columnName: string) => void;
}
export function useTableQuerySort(defaultSort: ISortInformation): ISortApi {
    const [sort, setSort] = React.useState<ISortInformation>(defaultSort);

    function changeSort(columnName: string) {
        let direction = SortDirection.ASC;

        if (sort && sort.field === columnName) {
            direction = sort.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
        }
        setSort({
            field: columnName,
            direction,
        });
    }

    return {
        current: sort,
        changeSort,
    };
}
