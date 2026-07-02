import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export function usePersistedStateId(): string {
    const id = useConstant<string>(() => uuid());
    return id;
}
