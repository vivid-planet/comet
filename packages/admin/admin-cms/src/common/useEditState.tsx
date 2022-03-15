import { ApolloError, ApolloQueryResult, OperationVariables, useQuery } from "@apollo/client";
import { DocumentNode } from "graphql";
import isEqual from "lodash.isequal";
import React from "react";

interface EditStateOptions<TData, TVariables, TState, TOutput> {
    query: DocumentNode;
    mode: "edit" | "add";
    variables?: TVariables;
    input2State: (data: TData) => TState;
    state2Output: (state: TState) => TOutput;
    defaultState: TState;
}

interface EditStateReturn<TData, TVariables, TState, TOutput> {
    hasChanges: boolean;
    state?: TState;
    setState: React.Dispatch<React.SetStateAction<TState | undefined>>;
    updateReferenceContent: (data: TData) => void;
    output?: TOutput;
    query: {
        data?: TData;
        refetch: (variables?: Partial<TVariables> | undefined) => Promise<ApolloQueryResult<TData>>;
        error?: ApolloError;
        loading: boolean;
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEditState<TData = any, TVariables = OperationVariables, TState = any, TOutput = any>(
    options: EditStateOptions<TData, TVariables, TState, TOutput>,
): EditStateReturn<TData, TVariables, TState, TOutput> {
    const [referenceContent, setReferenceContent] = React.useState<TOutput | undefined>(
        options.mode === "add" ? options.state2Output(options.defaultState) : undefined,
    );
    const [state, setState] = React.useState<TState | undefined>(options.mode === "add" ? options.defaultState : undefined);

    const {
        data: queryData,
        refetch,
        error,
        loading,
    } = useQuery<TData, TVariables>(options.query, {
        variables: options.variables,
        skip: options.mode === "add",
    });

    React.useEffect(() => {
        if (queryData) {
            const state = options.input2State(queryData);
            setState(state);
            setReferenceContent(options.state2Output(state));
        }
        // only set initial state, to avoid endless render loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryData, options.mode]);

    const updateReferenceContent = React.useCallback(
        (data: TData) => {
            const state = options.input2State(data);
            setReferenceContent(options.state2Output(state));
        },
        // only use options.mode to avoid endless render loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [options.mode],
    );

    return {
        hasChanges: state ? !isEqual(referenceContent, options.state2Output(state)) : false,
        state,
        setState,
        updateReferenceContent,
        output: state ? options.state2Output(state) : undefined,
        query: {
            data: queryData,
            refetch,
            error,
            loading,
        },
    };
}
