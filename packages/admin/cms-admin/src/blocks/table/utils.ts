import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { type TableBlockData } from "../../blocks.generated";

export const getNewColumn = (): TableBlockData["columns"][number] => {
    return { id: uuid(), highlighted: false, size: "standard" };
};

export const getNewRow = (cellValues: TableBlockData["rows"][number]["cellValues"]): TableBlockData["rows"][number] => {
    return { id: uuid(), highlighted: false, cellValues };
};

export const insertRowAtIndex = (state: TableBlockData, newRow: TableBlockData["rows"][number], index: number) => {
    const rowsBeforeIndex = state.rows.slice(0, index);
    const rowsAfterIndex = state.rows.slice(index);
    return { ...state, rows: [...rowsBeforeIndex, newRow, ...rowsAfterIndex] };
};

export const getInitialTableData = (): {
    rows: TableBlockData["rows"];
    columns: TableBlockData["columns"];
} => {
    const columnIdOne = uuid();
    const columnIdTwo = uuid();

    return {
        rows: [
            {
                id: uuid(),
                highlighted: false,
                cellValues: [
                    { columnId: columnIdOne, value: "" },
                    { columnId: columnIdTwo, value: "" },
                ],
            },
            {
                id: uuid(),
                highlighted: false,
                cellValues: [
                    { columnId: columnIdOne, value: "" },
                    { columnId: columnIdTwo, value: "" },
                ],
            },
        ],
        columns: [
            {
                id: columnIdOne,
                size: "standard",
                highlighted: false,
            },
            {
                id: columnIdTwo,
                size: "standard",
                highlighted: false,
            },
        ],
    };
};

const recentlyPastedDurationMs = 5_000;

export const useRecentlyPastedIds = () => {
    const [recentlyPastedIds, setRecentlyPastedIds] = useState<string[]>([]);
    const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

    useEffect(() => {
        const timeouts = timeoutsRef.current;
        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout));
        };
    }, []);

    const addToRecentlyPastedIds = useCallback((id: string) => {
        setRecentlyPastedIds((prev) => [...prev, id]);

        const timeoutId = setTimeout(() => {
            setRecentlyPastedIds((prev) => prev.filter((prevId) => prevId !== id));
            timeoutsRef.current.delete(timeoutId);
        }, recentlyPastedDurationMs);

        timeoutsRef.current.add(timeoutId);
    }, []);

    return {
        recentlyPastedIds,
        addToRecentlyPastedIds,
    };
};

export const columnSizeSchema = z.enum(["extraSmall", "small", "standard", "large", "extraLarge"]);
export type ColumnSize = z.infer<typeof columnSizeSchema>;

export const clipboardColumnSchema = z.object({
    type: z.literal("tableBlockColumn"),
    size: columnSizeSchema,
    highlighted: z.boolean(),
    cellValues: z.array(z.string()),
});
export type ClipboardColumn = z.infer<typeof clipboardColumnSchema>;
