import { useEffect, useState } from "react";

export function useBufferedRowCount(rowCount: number | undefined) {
    // Some API clients return undefined while loading
    // Following lines are here to prevent `rowCountState` from being undefined during the loading
    const [rowCountState, setRowCountState] = useState(0);

    useEffect(() => {
        setRowCountState((prevRowCountState) => (rowCount !== undefined ? rowCount : prevRowCountState));
    }, [rowCount, setRowCountState]);

    return rowCountState;
}
