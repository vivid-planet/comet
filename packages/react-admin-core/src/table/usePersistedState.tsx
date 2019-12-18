import * as React from "react";

const allStates: { [key: string]: any } = {};

interface IOptions {
    persistedStateId?: string;
}
export function usePersistedState<T>(defaultValue: T, options: IOptions = {}): [T, React.Dispatch<React.SetStateAction<T>>] {
    const stateId = options.persistedStateId;

    const v = (stateId && allStates[stateId]) || defaultValue;

    const [state, setState] = React.useState<T>(v);
    if (stateId) delete allStates[stateId]; // delete from allStates as the component is mounted now and handles it's state itself

    React.useEffect(() => {
        return () => {
            // on unmount we backukp the current state into allStates
            if (stateId) allStates[stateId] = state;
        };
    }, [state]);
    return [state, setState];
}
