import { GridEventListener } from "@mui/x-data-grid-pro";

import { ColumnDataItem, ColumnSize, getNewColumn, RowData } from "./TableBlockAdminWithDataGrid";

type Params = {
    columnData: ColumnDataItem[];
    setColumnData: React.Dispatch<React.SetStateAction<ColumnDataItem[]>>;
    rowData: RowData[];
    setRowData: React.Dispatch<React.SetStateAction<RowData[]>>;
};

export const getColumnUtils = ({ columnData, setColumnData, rowData, setRowData }: Params) => {
    const handleColumnOrderChange: GridEventListener<"columnOrderChange"> = (params) => {
        const movingColumnId = params.field;
        const oldPosition = params.oldIndex;
        const newPosition = params.targetIndex;

        setColumnData((previousColumnData) => {
            const updatedColumnData = previousColumnData.map((column) => {
                if (column.id === movingColumnId) {
                    return { ...column, position: newPosition };
                }

                if (oldPosition < newPosition) {
                    if (column.position > oldPosition && column.position <= newPosition) {
                        return { ...column, position: column.position - 1 };
                    }
                } else {
                    if (column.position >= newPosition && column.position < oldPosition) {
                        return { ...column, position: column.position + 1 };
                    }
                }

                return column;
            });

            return updatedColumnData.sort((a, b) => a.position - b.position);
        });
    };

    const addColumn = (afterPosition: number) => {
        setColumnData((existingColumns) => {
            const updatedExistingColumns = existingColumns.map((column) => ({
                ...column,
                position: column.position > afterPosition ? column.position + 1 : column.position,
            }));
            return [...updatedExistingColumns, getNewColumn(afterPosition + 1)].sort((a, b) => a.position - b.position);
        });
    };

    const toggleColumnHighlighted = (id: string) => {
        setColumnData((columns) => {
            return columns.map((column) => {
                if (column.id === id) {
                    return { ...column, highlighted: !column.highlighted };
                }
                return column;
            });
        });
    };

    const setColumnSize = (id: string, size: ColumnSize) => {
        setColumnData((columns) => {
            return columns.map((column) => {
                if (column.id === id) {
                    return { ...column, size: size };
                }
                return column;
            });
        });
    };

    const deleteColumn = (idOfColumnToDelete: string, positionOfColumnToDelete: number) => {
        setColumnData((existingColumns) => {
            const newColumns = existingColumns
                .filter((column) => column.id !== idOfColumnToDelete)
                .map((column) => ({
                    ...column,
                    position: column.position > positionOfColumnToDelete ? column.position - 1 : column.position,
                }));

            if (newColumns.length === 0) {
                return [getNewColumn(1)];
            }

            return newColumns;
        });

        setRowData((previousRowData) => {
            return previousRowData.map((row) => {
                const { [idOfColumnToDelete]: _, ...remainingColumnValues } = row.columnValues;
                return {
                    ...row,
                    columnValues: remainingColumnValues,
                };
            });
        });
    };

    const copyColumnToClipboard = (columnId: string) => {
        const data = {
            column: columnData.find((column) => column.id === columnId),
            rowValues: rowData.reduce((acc: Record<string, string>, { id: rowId, columnValues }) => {
                acc[rowId] = columnValues[columnId];
                return acc;
            }, {}),
        };

        navigator.clipboard.writeText(JSON.stringify(data));
    };

    const pasteColumnFromClipboard = (position: number) => {
        navigator.clipboard.readText().then((clipboardData) => {
            const { rowValues } = JSON.parse(clipboardData);
            // TODO: Validate JSON (zod?)

            const newColumn = getNewColumn(position);
            const newColumnId = newColumn.id;

            setColumnData((existingColumns) => {
                const updatedExistingColumns = existingColumns.map((column) => ({
                    ...column,
                    position: column.position >= position ? column.position + 1 : column.position,
                }));
                return [...updatedExistingColumns, newColumn].sort((a, b) => a.position - b.position);
            });

            setRowData((existingRows) => {
                return existingRows.map((row) => {
                    return {
                        ...row,
                        columnValues: {
                            ...row.columnValues,
                            [newColumnId]: rowValues[row.id] || "",
                        },
                    };
                });
            });
        });
    };

    const duplicateColumn = (id: string) => {
        const columnToDuplicate = columnData.find((column) => column.id === id);
        if (columnToDuplicate) {
            setColumnData((existingColumns) => {
                const updatedExistingColumns = existingColumns.map((column) => ({
                    ...column,
                    position: column.position > columnToDuplicate.position ? column.position + 1 : column.position,
                }));
                return [...updatedExistingColumns, { ...columnToDuplicate, id: getNewColumn(columnToDuplicate.position + 1).id }].sort(
                    (a, b) => a.position - b.position,
                );
            });

            // TODO: Fix row data duplication
            setRowData((existingRows) => {
                return existingRows.map((row) => {
                    return {
                        ...row,
                        columnValues: {
                            ...row.columnValues,
                            [getNewColumn(columnToDuplicate.position + 1).id]: row.columnValues[id],
                        },
                    };
                });
            });
        }
    };

    return {
        handleColumnOrderChange,
        addColumn,
        toggleColumnHighlighted,
        setColumnSize,
        deleteColumn,
        copyColumnToClipboard,
        pasteColumnFromClipboard,
        duplicateColumn,
    };
};
