import useConstant from "use-constant";
import { v4 as uuidv4 } from "uuid";

export function usePersistedStateId(): string {
    const id = useConstant<string>(() => uuidv4());
    return id;
}
