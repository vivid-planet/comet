import useConstant from "use-constant";
import { v4 } from "uuid";

export function usePersistedStateId(): string {
    const id = useConstant<string>(() => v4());
    return id;
}
