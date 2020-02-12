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
        ref.current.subscribe(
            debounce(formState => {
                if (!isEqual(filters, formState.values)) {
                    setFilters(formState.values);
                    if (options.pagingApi) {
                        options.pagingApi.changePage(options.pagingApi.init, 1);
                    }
                }
            }, 500),
            { values: true },
        );
    }

    return {
        current: filters,
        formApi: ref.current,
    };
}
