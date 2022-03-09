import * as React from "react";

// inspired by https://stackoverflow.com/questions/24613955/is-there-a-type-in-typescript-for-anything-except-functions#answer-48045023
type NoFunctionValue = boolean | string | number | null | undefined | NoFunctionObject | NoFunctionArray;

type NoFunctionObject = Record<string, unknown>; // @TODO this is not accurate, must be an object without functions as values

type NoFunctionArray = Array<NoFunctionValue>;

// inspired by https://usehooks.com/useLocalStorage/
function useStoredState<S extends NoFunctionValue = undefined>(
    key: string | false,
    initialValue: S | (() => S),
    storage = window.localStorage,
): [S, React.Dispatch<React.SetStateAction<S>>] {
    const [state, setState] = React.useState<S>(() => {
        if (key === false) {
            return initialValue instanceof Function ? initialValue() : initialValue;
        }

        try {
            const item = storage.getItem(key);
            return item ? (JSON.parse(item) as S) : initialValue instanceof Function ? initialValue() : initialValue;
        } catch (error) {
            // If error also return initialValue
            // eslint-disable-next-line no-console
            console.log(error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    });

    const serializedState = React.useMemo(() => JSON.stringify(state), [state]);

    React.useEffect(() => {
        if (key === false) {
            return;
        }

        try {
            storage.setItem(key, serializedState);
        } catch (error) {
            // A more advanced implementation would handle the error case
            // eslint-disable-next-line no-console
            console.log(error);
        }
    }, [serializedState, key, storage]);

    return [state, setState];
}
export { useStoredState };
