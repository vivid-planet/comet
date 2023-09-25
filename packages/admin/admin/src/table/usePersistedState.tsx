import * as React from "react";

const allStates: { [key: string]: any } = {};

interface IOptions {
    persistedStateId?: string;
}
/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export function usePersistedState<T>(defaultValue: T, options: IOptions = {}): [T, React.Dispatch<React.SetStateAction<T>>] {
    const stateId = options.persistedStateId;

    const v = (stateId && allStates[stateId]) || defaultValue;

    const [state, setState] = React.useState<T>(v);
    if (stateId) delete allStates[stateId]; // delete from allStates as the component is mounted now and handles it's state itself

    React.useEffect(() => {
        return () => {
            // on unmount we backup the current state into allStates
            if (stateId) allStates[stateId] = state;
        };
    }, [state, stateId]);
    return [state, setState];
}
