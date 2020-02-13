import { debounce } from "debounce";
import { AnyObject, createForm, FormApi } from "final-form";
import isEqual = require("lodash.isequal");
import * as React from "react";
import { usePersistedState } from "./usePersistedState";
import { IPagingApi } from "./useTableQueryPaging";

export interface IFilterApi<FilterValues extends AnyObject> {
    current: FilterValues;
    formApi: FormApi<FilterValues>;
}
export function useTableQueryFilter<FilterValues extends AnyObject>(
    defaultValues: FilterValues,
    options: {
        pagingApi?: IPagingApi<any>;
        persistedStateId?: string;
    } = {},
): IFilterApi<FilterValues> {
    const [filters, setFilters] = usePersistedState<FilterValues>(defaultValues, { persistedStateId: options.persistedStateId + "_filter" });
    const ref = React.useRef<FormApi<FilterValues>>();
    if (!ref.current) {
        ref.current = createForm({
            initialValues: filters,
            onSubmit: values => {
                // Nothing todo
            },
        });
    }

    React.useEffect(() => {
        if (!ref.current) return;
        return ref.current.subscribe(
            debounce(formState => {
                const newValues = formState.values;
                if (!isEqual(filters, newValues)) {
                    setFilters(newValues);
                    if (options.pagingApi) {
                        options.pagingApi.changePage(options.pagingApi.init, 1);
                    }
                }
            }, 500),
            { values: true },
        );
    }, [filters]);

    return {
        current: filters,
        formApi: ref.current,
    };
}
