import { AnyObject } from "final-form";
import * as React from "react";
import { IPagingApi } from "./useTableQueryPaging";

export interface IFilterApi<FilterValues extends AnyObject> {
    current: FilterValues;
    changeFilters: (values: FilterValues) => void;
}
export function useTableQueryFilter<FilterValues extends AnyObject>(
    defaultValues: FilterValues,
    pagingApi?: IPagingApi<any>,
): IFilterApi<FilterValues> {
    const [filters, setFilters] = React.useState<FilterValues>(defaultValues);

    function changeFilters(v: FilterValues) {
        setFilters(v);

        if (pagingApi) {
            pagingApi.changePage(pagingApi.init);
        }
    }

    return {
        current: filters,
        changeFilters,
    };
}
