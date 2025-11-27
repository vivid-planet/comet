import { readClipboardText } from "@comet/admin";
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

export const columnInsertSchema = z.object({
    size: columnSizeSchema,
    highlighted: z.boolean(),
    cellValues: z.array(z.string()),
});
export type ColumnInsertData = z.infer<typeof columnInsertSchema>;

export const getClipboardValueForSchema = async <T>(schema: z.ZodSchema<T>): Promise<T | null> => {
    const clipboardData = await readClipboardText();

    if (!clipboardData) {
        return null;
    }

    let jsonClipboardData;
    try {
        jsonClipboardData = JSON.parse(clipboardData);
    } catch {
        return null;
    }

    const validatedClipboardData = schema.safeParse(jsonClipboardData);

    if (!validatedClipboardData.success) {
        return null;
    }

    return validatedClipboardData.data;
};

export const getNewColumnInsertData = (numberOfRows: number): ColumnInsertData => {
    return {
        size: "standard",
        highlighted: false,
        cellValues: Array.from({ length: numberOfRows }).map(() => ""),
    };
};

export const getDuplicatedColumnInsertData = (state: TableBlockData, columnIndex: number): ColumnInsertData | null => {
    const sourceColumn = state.columns[columnIndex];

    if (!sourceColumn) {
        return null;
    }

    const sourceCellsValues = state.rows.map(({ cellValues }) => cellValues.find((cellValue) => cellValue.columnId === sourceColumn.id));
    const newCellValues = sourceCellsValues.map((sourceCellValue) => sourceCellValue?.value ?? "");

    return {
        size: sourceColumn.size,
        highlighted: sourceColumn.highlighted,
        cellValues: newCellValues,
    };
};

export const getInsertDataFromColumnById = (state: TableBlockData, columnId: string): ColumnInsertData | null => {
    const column = state.columns.find(({ id }) => id === columnId);
    if (!column) {
        return null;
    }

    return {
        size: column.size,
        highlighted: column.highlighted,
        cellValues: state.rows.map((row) => {
            const cellValueOfColumn = row.cellValues.find((cellValue) => cellValue.columnId === columnId);
            return cellValueOfColumn?.value ?? "";
        }),
    };
};

export const insertColumnDataAtIndex = (
    state: TableBlockData,
    columnInsertData: ColumnInsertData,
    index: number,
    newColumnId: string = uuid(),
): TableBlockData => {
    const numberOfRowsToBeAdded = columnInsertData.cellValues.length - state.rows.length;

    for (let i = 0; i < numberOfRowsToBeAdded; i++) {
        const newRow = getNewRow(state.columns.map((column) => ({ columnId: column.id, value: "" })));
        state = insertRowAtIndex(state, newRow, state.rows.length);
    }

    const columnsBeforeIndex = state.columns.slice(0, index);
    const columnsAfterIndex = state.columns.slice(index);
    const newColumn = {
        id: newColumnId,
        size: columnInsertData.size,
        highlighted: columnInsertData.highlighted,
    };

    return {
        ...state,
        columns: [...columnsBeforeIndex, newColumn, ...columnsAfterIndex],
        rows: state.rows.map((row, index) => {
            const newCell = { columnId: newColumn.id, value: columnInsertData.cellValues[index] ?? "" };
            return {
                ...row,
                cellValues: [...row.cellValues, newCell],
            };
        }),
    };
};

export const removeColumnFromState = (state: TableBlockData, columnId: string): TableBlockData => {
    return {
        ...state,
        columns: state.columns.filter((column) => column.id !== columnId),
        rows: state.rows.map((row) => ({
            ...row,
            cellValues: row.cellValues.filter((cellValue) => cellValue.columnId !== columnId),
        })),
    };
};

export const toggleColumnHighlight = (state: TableBlockData, columnId: string): TableBlockData => {
    return {
        ...state,
        columns: state.columns.map((column) => {
            if (column.id === columnId) {
                return { ...column, highlighted: !column.highlighted };
            }
            return column;
        }),
    };
};

export const setColumnSize = (state: TableBlockData, columnId: string, size: ColumnSize): TableBlockData => {
    return {
        ...state,
        columns: state.columns.map((column) => (column.id === columnId ? { ...column, size } : column)),
    };
};
