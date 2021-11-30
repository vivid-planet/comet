import { AnyObject, createForm, FormApi } from "final-form";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import * as React from "react";

import { usePersistedState } from "./usePersistedState";
import { IPagingApi } from "./useTableQueryPaging";

export interface IFilterApi<FilterValues extends AnyObject> {
    current: FilterValues;
    formApi: FormApi<FilterValues>;
}
export function useTableQueryFilter<FilterValues>(
    defaultValues: FilterValues,
    options: {
        pagingApi?: IPagingApi<any>;
        persistedStateId?: string;
    } = {},
): IFilterApi<FilterValues> {
    const [filters, setFilters] = usePersistedState<FilterValues>(defaultValues, {
        persistedStateId: options.persistedStateId ? `${options.persistedStateId}_filter` : undefined,
    });
    const ref = React.useRef<FormApi<FilterValues>>();
    if (!ref.current) {
        ref.current = createForm({
            initialValues: filters,
            onSubmit: (values) => {
                // Nothing todo
            },
        });
    }

    React.useEffect(() => {
        if (!ref.current) return;
        const unsubscribe = ref.current.subscribe(
            debounce(
                (formState) => {
                    const newValues = formState.values;
                    if (!isEqual(filters, newValues)) {
                        setFilters(newValues);
                        if (options.pagingApi) {
                            options.pagingApi.changePage(options.pagingApi.init, 1, { noScrollToTop: true });
                        }
                    }
                },
                500,
                { leading: true, trailing: true },
            ),
            { values: true },
        );
        return unsubscribe;
    }, [filters, options.pagingApi, setFilters]);

    return {
        current: filters,
        formApi: ref.current,
    };
}
