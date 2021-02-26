import useConstant from "use-constant";

const UUID = require("uuid");

export function usePersistedStateId(): string {
    const id = useConstant<string>(() => UUID.v4());
    return id;
}
