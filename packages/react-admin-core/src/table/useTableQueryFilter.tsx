import { AnyObject } from "final-form";
import * as React from "react";
import { usePersistedState } from "./usePersistedState";
import { IPagingApi } from "./useTableQueryPaging";

export interface IFilterApi<FilterValues extends AnyObject> {
    current: FilterValues;
    changeFilters: (values: FilterValues) => void;
    defaultValues: FilterValues;
}
export function useTableQueryFilter<FilterValues extends AnyObject>(
    defaultValues: FilterValues,
    options: {
        pagingApi?: IPagingApi<any>;
        persistedStateId?: string;
    } = {},
): IFilterApi<FilterValues> {
    const [filters, setFilters] = usePersistedState<FilterValues>(defaultValues, { persistedStateId: options.persistedStateId + "_filter" });

    function changeFilters(v: FilterValues) {
        setFilters(v);

        if (options.pagingApi) {
            options.pagingApi.changePage(options.pagingApi.init, 1);
        }
    }

    return {
        current: filters,
        changeFilters,
        defaultValues,
    };
}
