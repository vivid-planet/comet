import * as React from "react";
import useConstant from "use-constant";

const UUID = require("uuid");

export function useCreatePersistedStateId(): string {
    const id = useConstant<string>(() => UUID.v4());
    return id;
}
