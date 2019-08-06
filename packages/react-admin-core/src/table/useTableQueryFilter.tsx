import { AnyObject } from "final-form";
import * as React from "react";

export interface IFilterApi<FilterValues extends AnyObject> {
    current: FilterValues;
    changeFilters: (values: FilterValues) => void;
}
export function useTableQueryFilter<FilterValues extends AnyObject>(defaultValues: FilterValues): IFilterApi<FilterValues> {
    const [filters, setFilters] = React.useState<FilterValues>(defaultValues);

    function changeFilters(v: FilterValues) {
        setFilters(v);
    }

    return {
        current: filters,
        changeFilters,
    };
}
