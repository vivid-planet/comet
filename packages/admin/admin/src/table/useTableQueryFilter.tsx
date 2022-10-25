import { AnyObject, createForm, FormApi } from "final-form";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import * as React from "react";

import { useStoredState } from "../hooks/useStoredState";
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
        browserStorage?: Storage;
    } = {},
): IFilterApi<FilterValues> {
    const filterId = `${options.persistedStateId}_filter`;

    if (options.browserStorage && !options.persistedStateId) {
        throw new Error("When using browserStorage you must provide a persistedStateId");
    }

    const persistedState = usePersistedState<FilterValues>(defaultValues, {
        persistedStateId: options.persistedStateId ? filterId : undefined,
    });
    const storedState = useStoredState<FilterValues>(filterId, defaultValues, options.browserStorage);

    const [filters, setFilters] = options.browserStorage ? storedState : persistedState;

    const ref = React.useRef<FormApi<FilterValues>>();
    if (!ref.current) {
        ref.current = createForm<FilterValues>({
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
