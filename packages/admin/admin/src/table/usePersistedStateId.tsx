import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

export function usePersistedStateId(): string {
    const id = useConstant<string>(() => uuid());
    return id;
}
