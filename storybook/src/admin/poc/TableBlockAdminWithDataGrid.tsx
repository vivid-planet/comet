import { GridColDef, RowActionsItem, RowActionsMenu, SaveButton } from "@comet/admin";
import { AddFilled, Delete, DragIndicator } from "@comet/admin-icons";
import { Box, Dialog, DialogActions, DialogTitle, InputBase, InputBaseProps, Paper, Popper } from "@mui/material";
import { DataGridPro, GRID_REORDER_COL_DEF, GridRenderEditCellParams, GridRowId, useGridApiContext, useGridApiRef } from "@mui/x-data-grid-pro";
import { GridApiPro } from "@mui/x-data-grid-pro/models/gridApiPro";
import { storiesOf } from "@storybook/react";
import React, { useMemo } from "react";

/**
 * Known issues
 * - Moving columns is only possible after clicking the respective column header. This is not the case by default, see: https://v5.mui.com/x/react-data-grid/demo/
 * - While scrolling, the dialog-header and probably the grid-header should be sticky
 * - The horizontal scrollbar is not at the bottom of the dialog, if the grid is smaller
 * - ColumnLine/RowLine is really buggy and requires force-re-render and are incorrectly positioned if the current column/row is not virtualized
 * - Currently dragged column/row should be highlighted
 */

const commonColumnSettings: Partial<GridColDef> = {
    headerName: "",
    editable: true,
    sortable: false,
    type: "string",
    flex: 1,
    minWidth: 200, // TODO: What should this be? Dependant on the admin-defined column width (sm,md,lg,xl)?
    renderHeader: ({ field }) => {
        // TODO: style properly
        return (
            <>
                <Box
                    sx={{
                        position: "relative",
                        cursor: "move",
                        width: 50,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <DragIndicator />
                </Box>
                <RowActionsMenu>
                    <RowActionsMenu>
                        <RowActionsItem
                            icon={<Delete />}
                            onClick={() => {
                                console.log("### Delete column", field);
                            }}
                        >
                            Delete
                        </RowActionsItem>
                    </RowActionsMenu>
                </RowActionsMenu>
            </>
        );
    },
    renderEditCell: (params) => <EditTextarea {...params} />,
};

// const numberOfColumns = 10;

// const columns: GridColDef[] = Array.from({ length: numberOfColumns }, (_, index) => ({
//     field: `${index + 1}`,
//     ...commonColumnSettings,
// }));

const getColumns = (columnCount: number): GridColDef[] => {
    const columns = Array.from({ length: columnCount }, (_, index) => ({
        field: `${index + 1}`,
        ...commonColumnSettings,
    }));
    return columns;
};

type Row = {
    id: GridRowId;
    [key: number]: string;
};

const getRows = (rowCount: number, columnCount: number) => {
    const rows = Array.from({ length: rowCount }, (_, rowIndex) => {
        const row: Row = { id: rowIndex + 1 };

        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            row[columnIndex + 1] = `Row ${rowIndex + 1}, Column ${columnIndex + 1}`;
        }

        return row;
    });
    return rows;
};

const EditTextarea = ({ id, field, value, colDef }: GridRenderEditCellParams<string>) => {
    const [valueState, setValueState] = React.useState(value);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>();
    const apiRef = useGridApiContext();

    const handleRef = React.useCallback((el: HTMLElement | null) => {
        setAnchorEl(el);
    }, []);

    const handleChange = React.useCallback<NonNullable<InputBaseProps["onChange"]>>(
        (event) => {
            const newValue = event.target.value;
            setValueState(newValue);
            apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 }, event);
        },
        [apiRef, field, id],
    );

    const handleKeyDown = React.useCallback<NonNullable<InputBaseProps["onKeyDown"]>>(
        (event) => {
            if (event.key === "Escape" || (event.key === "Enter" && !event.shiftKey && (event.ctrlKey || event.metaKey))) {
                const params = apiRef.current.getCellParams(id, field);
                apiRef.current.publishEvent("cellKeyDown", params, event);
            }
        },
        [apiRef, id, field],
    );

    return (
        <div style={{ position: "relative", alignSelf: "flex-start" }}>
            <div
                ref={handleRef}
                style={{
                    height: 1,
                    width: colDef.computedWidth,
                    display: "block",
                    position: "absolute",
                    top: 0,
                }}
            />
            <Popper
                open={!!anchorEl}
                anchorEl={anchorEl}
                placement="bottom-start"
                onResizeCapture={undefined}
                onResize={undefined}
                sx={{
                    zIndex: 999999, // TODO: What should this be?
                }}
            >
                <Paper
                    elevation={1}
                    sx={{
                        padding: 1,
                    }}
                >
                    <InputBase
                        multiline
                        value={valueState}
                        sx={(theme) => ({
                            textarea: {
                                resize: "both",
                                minHeight: `calc(55px - ${theme.spacing(2)})`,
                                minWidth: `calc(${colDef.computedWidth}px - ${theme.spacing(2)})`,
                                boxSizing: "border-box",
                            },
                            width: "100%",
                            height: "100%",
                        })}
                        onChange={handleChange}
                        autoFocus
                        onKeyDown={handleKeyDown}
                    />
                </Paper>
            </Popper>
        </div>
    );
};

type ColumnLineProps = {
    column: GridColDef;
    apiRef: React.MutableRefObject<GridApiPro>;
};

const ColumnLine = ({ column, apiRef }: ColumnLineProps) => {
    let leftPositionFromDataGrid = 0;
    let dataGridHeight = 0;

    if (apiRef.current) {
        if ("getColumnHeaderElement" in apiRef.current) {
            const columnHeaderHtmlElement = apiRef.current.getColumnHeaderElement(column.field);
            const dataGridHtmlElement = columnHeaderHtmlElement?.closest(".MuiDataGrid-root");
            const columnHeadersHtmlElement = dataGridHtmlElement?.querySelector(".MuiDataGrid-columnHeaders");
            const virtualScrollerHtmlElement = dataGridHtmlElement?.querySelector(".MuiDataGrid-virtualScroller");

            // @ts-expect-error TODO: Improve this
            leftPositionFromDataGrid = columnHeaderHtmlElement?.getBoundingClientRect()?.left - dataGridHtmlElement?.getBoundingClientRect()?.left;
            dataGridHeight =
                // @ts-expect-error TODO: Improve this
                columnHeadersHtmlElement?.getBoundingClientRect()?.height + virtualScrollerHtmlElement?.getBoundingClientRect()?.height + 1;
        }
    }

    return (
        <Box
            sx={(theme) => ({
                position: "absolute",
                zIndex: 3,
                left: leftPositionFromDataGrid - 2,
                transform: "translateX(var(--datagrid-scroll-left, 0))",
                top: 0,
                height: dataGridHeight,
                width: 3,
                backgroundColor: `${theme.palette.primary.main}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // opacity: 0.1, // TODO: This should be 0
                opacity: 0, // TODO: This should be 0
                cursor: "pointer",
                transition: "opacity 100ms",

                "&:hover": {
                    opacity: 1,
                },

                "&::before": {
                    // hoverable area
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: -5,
                    right: -5,
                    bottom: 0,
                },

                "&:first-of-type": {
                    left: leftPositionFromDataGrid - 1,

                    "&::before": {
                        left: -2,
                    },
                },
            })}
            onClick={() => {
                console.log("### Adding column before", column.field);
            }}
        >
            <AddFilled color="primary" sx={{ backgroundColor: "white", pointerEvents: "none" }} />
        </Box>
    );
};

type RowLineProps = {
    row: {
        id: GridRowId;
        [key: string]: unknown;
    };
    apiRef: React.MutableRefObject<GridApiPro>;
};

const RowLine = ({ row, apiRef }: RowLineProps) => {
    let topPositionFromDataGrid = 0;
    let dataGridWidth = 0;

    if (apiRef.current) {
        if ("getRowElement" in apiRef.current) {
            let rowHtmlElement: HTMLElement | undefined | null = null;

            if (row.id === "__header__") {
                rowHtmlElement = apiRef.current.getColumnHeaderElement("__reorder__")?.closest(".MuiDataGrid-columnHeaders");
            } else {
                rowHtmlElement = apiRef.current.getRowElement(row.id);
            }

            const dataGridHtmlElement = rowHtmlElement?.closest(".MuiDataGrid-root");

            if (row.id === "__header__") {
                setTimeout(() => {
                    const el = dataGridHtmlElement?.querySelector(".MuiDataGrid-virtualScroller");
                    console.log("### Register Scroll event listner", el);

                    el?.addEventListener("scroll", (e) => {
                        const varEl = dataGridHtmlElement?.closest("[data-outside-of-grid-foo-bar]");
                        varEl?.style.setProperty("--datagrid-scroll-top", `-${el.scrollTop}px`);
                        varEl?.style.setProperty("--datagrid-scroll-left", `-${el.scrollLeft}px`);
                    });
                }, 2000);
            }

            topPositionFromDataGrid =
                // @ts-expect-error TODO: Improve this
                rowHtmlElement?.getBoundingClientRect()?.top - dataGridHtmlElement?.getBoundingClientRect()?.top + rowHtmlElement?.clientHeight;
            // @ts-expect-error TODO: Improve this
            dataGridWidth = dataGridHtmlElement?.getBoundingClientRect()?.width;
        }
    }

    return (
        <Box
            sx={(theme) => ({
                position: "absolute",
                zIndex: 2,
                top: topPositionFromDataGrid - 1,
                transform: "translateY(var(--datagrid-scroll-top, 0))",
                left: 0,
                width: dataGridWidth,
                height: 3,
                backgroundColor: `${theme.palette.primary.main}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // opacity: 0.1, // TODO: This should be 0
                opacity: 0, // TODO: This should be 0
                cursor: "pointer",
                transition: "opacity 100ms",

                "&:hover": {
                    opacity: 1,
                },

                "&::before": {
                    // hoverable area
                    content: '""',
                    position: "absolute",
                    top: -5,
                    left: 0,
                    right: 0,
                    bottom: -5,
                },
            })}
            onClick={() => {
                console.log("### Adding after row", row.id);
            }}
        >
            <AddFilled color="primary" sx={{ backgroundColor: "white", pointerEvents: "none" }} />
        </Box>
    );
};

const Story = () => {
    const [forceRenderIndex, setForceRenderIndex] = React.useState(0);
    const [numberOfRows, setNumberOfRows] = React.useState(10);
    const [numberOfColumns, setNumberOfColumns] = React.useState(5);

    const dataColumns = useMemo(() => getColumns(numberOfColumns), [numberOfColumns]);
    const rows = useMemo(() => getRows(numberOfRows, numberOfColumns), [numberOfRows, numberOfColumns]);
    const apiRef = useGridApiRef();

    const columns: GridColDef[] = [
        {
            ...GRID_REORDER_COL_DEF,
            minWidth: 36,
            maxWidth: 36,
        },
        ...dataColumns,
        {
            field: "actions",
            sortable: false,
            headerName: "",
            minWidth: 36,
            maxWidth: 36,
            disableReorder: true,
            renderCell: ({ row }) => {
                return (
                    <RowActionsMenu>
                        <RowActionsMenu>
                            <RowActionsItem
                                icon={<Delete />}
                                onClick={() => {
                                    console.log("### Delete row", row);
                                }}
                            >
                                Delete
                            </RowActionsItem>
                        </RowActionsMenu>
                    </RowActionsMenu>
                );
            },
        },
    ];

    return (
        <Dialog open maxWidth="xl">
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                POC: TableBlock admin using DataGrid
                <button onClick={() => setForceRenderIndex((prev) => prev + 1)}>Force render</button>
                <Box sx={{ display: "flex", gap: 2 }}>
                    Rows:
                    <input value={numberOfRows} onChange={(e) => setNumberOfRows(Number(e.target.value))} />
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    Columns:
                    <input value={numberOfColumns} onChange={(e) => setNumberOfColumns(Number(e.target.value))} />
                </Box>
            </DialogTitle>
            <div data-outside-of-grid-foo-bar>
                <Box key={forceRenderIndex} sx={{ position: "relative", overflow: "hidden" }}>
                    <Box data-column-lines-container>
                        {columns.map((column) => {
                            if (column.field === "__reorder__") {
                                return null;
                            }

                            return <ColumnLine key={column.field} column={column} apiRef={apiRef} />;
                        })}
                    </Box>
                    <Box data-row-lines-container>
                        {[{ id: "__header__" }, ...rows].map((row) => {
                            return <RowLine key={row.id} row={row} apiRef={apiRef} />;
                        })}
                    </Box>
                    <DataGridPro
                        columns={columns}
                        apiRef={apiRef}
                        rows={rows}
                        rowHeight={55}
                        rowReordering
                        disableColumnResize
                        disableColumnMenu
                        disableSelectionOnClick
                        hideFooter
                        pinnedColumns={{
                            left: ["__reorder__"],
                            right: ["actions"],
                        }}
                        components={{
                            RowReorderIcon: DragIndicator,
                        }}
                        sx={(theme) => ({
                            minHeight: "min(740px, calc(100vh - 40px))",
                            borderLeft: 0,
                            borderRight: 0,

                            ".MuiDataGrid-columnHeaderTitleContainerContent": {
                                width: "100%",
                                justifyContent: "space-between",
                            },
                            ".MuiDataGrid-columnHeader": {
                                borderBottom: `1px solid ${theme.palette.grey[100]}`,
                            },
                            ".MuiDataGrid-cell": {
                                borderBottom: `1px solid ${theme.palette.grey[100]} !important`,
                                borderTop: "none",
                            },
                            ".MuiDataGrid-cell:not(:last-child), .MuiDataGrid-columnHeader:not(:last-child)": {
                                borderRight: `1px solid ${theme.palette.grey[100]}`,
                            },
                            '.MuiDataGrid-cell[data-field="actions"]': {
                                padding: 0,
                                justifyContent: "center",
                            },
                            ".MuiDataGrid-columnSeparator": {
                                display: "none",
                            },
                            ".MuiDataGrid-columnHeaders, .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                            ".MuiDataGrid-rowReorderCell": {
                                height: "100%",
                            },
                            ".MuiDataGrid-pinnedColumns": {
                                boxShadow: "none",

                                "&--left .MuiDataGrid-cell": {
                                    borderRight: `1px solid ${theme.palette.grey[100]}`,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                },

                                "&--right .MuiDataGrid-cell": {
                                    borderLeft: `1px solid ${theme.palette.grey[100]}`,
                                },
                            },
                            ".MuiDataGrid-pinnedColumnHeaders": {
                                boxShadow: "none",

                                "&--left .MuiDataGrid-columnHeader": {
                                    borderRight: `1px solid ${theme.palette.grey[100]}`,
                                },

                                "&--right .MuiDataGrid-columnHeader": {
                                    borderLeft: `1px solid ${theme.palette.grey[100]}`,
                                },
                            },
                        })}
                        onRowOrderChange={(a, b, c) => {
                            console.log("### onRowOrderChange", { a, b, c });
                        }}
                        onColumnOrderChange={(a, b, c) => {
                            console.log("### onColumnOrderChange", { a, b, c });
                        }}
                        onCellEditCommit={(a, b, c) => {
                            console.log("### onCellEditCommit", { a, b, c });
                        }}
                    />
                </Box>
                <DialogActions>
                    <SaveButton />
                </DialogActions>
            </div>
        </Dialog>
    );
};

storiesOf("@comet/admin/POC", module).add("TableBlockAdminWithDataGrid", Story);
