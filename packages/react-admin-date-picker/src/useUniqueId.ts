import * as React from "react";

let uniqueId = 0;
const getUniqueId = () => uniqueId++;

const useUniqueId = (): string => {
    const idRef = React.useRef<number | null>(null);

    if (idRef.current === null) {
        idRef.current = getUniqueId();
    }

    return idRef.current.toString();
};

export default useUniqueId;
