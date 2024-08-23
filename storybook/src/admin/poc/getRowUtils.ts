import { GridEventListener } from "@mui/x-data-grid-pro";
import { v4 as uuid } from "uuid";

import { ColumnDataItem, RowData } from "./TableBlockAdminWithDataGrid";

type Params = {
    columnData: ColumnDataItem[];
    rowData: RowData[];
    setRowData: React.Dispatch<React.SetStateAction<RowData[]>>;
};

export const getRowUtils = ({ columnData, rowData, setRowData }: Params) => {
    const getNewRow = (position: number): RowData => ({
        id: uuid(),
        position,
        highlighted: false,
        columnValues: Object.fromEntries(columnData.map(({ id }) => [id, ""])),
    });

    const handleCellEditCommit: GridEventListener<"cellEditCommit"> = ({ value, field: columnId, id: rowId }) => {
        setRowData((previousRowData) => {
            return previousRowData.map((row) => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        columnValues: {
                            ...row.columnValues,
                            [columnId]: value,
                        },
                    };
                }
                return row;
            });
        });
    };

    const deleteRow = (idOfRowToDelete: string, positionOfRowToDelete: number) => {
        setRowData((rows) => {
            const newRows = rows
                .filter((row) => row.id !== idOfRowToDelete)
                .map((row) => {
                    return {
                        ...row,
                        position: row.position > positionOfRowToDelete ? row.position - 1 : row.position,
                    };
                });

            if (newRows.length === 0) {
                return [getNewRow(1)];
            }

            return newRows;
        });
    };

    const toggleRowHighlighted = (id: string) => {
        setRowData((rows) => {
            return rows.map((row) => {
                if (row.id === id) {
                    return { ...row, highlighted: !row.highlighted };
                }
                return row;
            });
        });
    };

    const addRow = (afterPosition: number) => {
        setRowData((existingRows) => {
            const updatedExistingRows = existingRows.map((row) => ({
                ...row,
                position: row.position > afterPosition ? row.position + 1 : row.position,
            }));

            return [...updatedExistingRows, getNewRow(afterPosition + 1)].sort((a, b) => a.position - b.position);
        });
    };

    const copyRowToClipboard = (id: string) => {
        const rowToCopy = rowData.find((row) => row.id === id);
        if (rowToCopy) {
            navigator.clipboard.writeText(JSON.stringify(rowToCopy));
        }
    };

    const pasteaRowFromClipboard = (position: number) => {
        navigator.clipboard.readText().then((clipboardContent) => {
            const parsedRow = JSON.parse(clipboardContent);
            // TODO: Validate JSON (zod?)

            if (parsedRow) {
                setRowData((existingRows) => {
                    const updatedExistingRows = existingRows.map((row) => ({
                        ...row,
                        position: row.position > position ? row.position + 1 : row.position,
                    }));

                    return [...updatedExistingRows, { ...parsedRow, position: position + 1 }].sort((a, b) => a.position - b.position);
                });
            }
        });
    };

    const duplicateRow = (id: string) => {
        const rowToDuplicate = rowData.find((row) => row.id === id);
        if (rowToDuplicate) {
            setRowData((existingRows) => {
                const updatedExistingRows = existingRows.map((row) => ({
                    ...row,
                    position: row.position > rowToDuplicate.position ? row.position + 1 : row.position,
                }));

                return [...updatedExistingRows, { ...rowToDuplicate, id: uuid(), position: rowToDuplicate.position + 1 }].sort(
                    (a, b) => a.position - b.position,
                );
            });
        }
    };

    const handleRowOrderChange: GridEventListener<"rowOrderChange"> = (params) => {
        const movingRowId: string = params.row.id;
        const oldPosition: number = params.row.position;
        const newPosition = params.targetIndex + 1;

        setRowData((previousRowData) => {
            const updatedRowData = previousRowData.map((row) => {
                if (row.id === movingRowId) {
                    return { ...row, position: newPosition };
                }

                if (oldPosition < newPosition) {
                    if (row.position > oldPosition && row.position <= newPosition) {
                        return { ...row, position: row.position - 1 };
                    }
                } else {
                    if (row.position >= newPosition && row.position < oldPosition) {
                        return { ...row, position: row.position + 1 };
                    }
                }

                return row;
            });

            return updatedRowData.sort((a, b) => a.position - b.position);
        });
    };

    return {
        handleCellEditCommit,
        deleteRow,
        toggleRowHighlighted,
        addRow,
        copyRowToClipboard,
        pasteaRowFromClipboard,
        duplicateRow,
        handleRowOrderChange,
    };
};
