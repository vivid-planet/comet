import { debounce } from "debounce";
import { AnyObject, createForm, FormApi } from "final-form";
import isEqual = require("lodash.isequal");
import * as React from "react";
import { IPagingApi } from "./useTableQueryPaging";

export interface IFilterApi<FilterValues extends AnyObject> {
    current: FilterValues;
    formApi: FormApi<FilterValues>;
}
export function useTableQueryFilter<FilterValues extends AnyObject>(
    defaultValues: FilterValues,
    pagingApi?: IPagingApi<any>,
): IFilterApi<FilterValues> {
    const [filters, setFilters] = React.useState<FilterValues>(defaultValues);

    const ref = React.useRef<FormApi<FilterValues>>();
    if (!ref.current) {
        ref.current = createForm({
            initialValues: defaultValues,
            onSubmit: values => {
                // Nothing todo
            },
        });
        ref.current.subscribe(
            debounce(formState => {
                if (!isEqual(filters, formState.values)) {
                    setFilters(formState.values);
                    if (pagingApi) {
                        pagingApi.changePage(pagingApi.init, 1);
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
