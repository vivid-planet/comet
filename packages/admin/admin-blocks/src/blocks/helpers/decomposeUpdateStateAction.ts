import { DispatchSetStateAction, SetStateAction } from "../types";
import { resolveNewState } from "../utils";

type InferedState<T> = T extends DispatchSetStateAction<infer S> ? S : never;

/**
 * Modify a given dispatch action to update only a whitelisted subset of attributes
 * State of dispatch action must be an object
 * In the example below the newly returned dispatch function would only update "bar", values under attribute "foo" are not updated
 *
 * @param action  f.i. pass a DispatchSetStateAction which updates the state {foo: number, bar: string}
 * @param whiteKeys f.i. define ["bar"] as whitelist
 */
export default function decomposeUpdateStateAction<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    D extends DispatchSetStateAction<any>,
    S extends InferedState<D>,
    Whitelisted extends keyof S,
>(action: D, whiteKeys: Array<Whitelisted>): DispatchSetStateAction<Pick<S, Whitelisted>> {
    return function decomposedUpdateStateAction(setStateAction: SetStateAction<Pick<S, Whitelisted>>): void {
        action((prevState: S) => {
            const stateWhitelistedToUpdate = Object.entries(prevState).reduce((acc, [key, value]) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (whiteKeys.includes(key as any)) {
                    return {
                        ...acc,
                        [key]: value,
                    };
                } else {
                    return acc;
                }
            }, {});

            return {
                ...prevState,
                ...resolveNewState({ prevState: stateWhitelistedToUpdate, setStateAction }),
            };
        });
    };
}
