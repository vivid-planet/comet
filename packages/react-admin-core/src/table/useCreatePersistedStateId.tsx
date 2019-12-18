import * as React from "react";

const UUID = require("uuid");

export function useCreatePersistedStateId(): string {
    const id = React.useMemo(() => UUID.v4(), []);
    return id;
}
