import { InputBase, InputBaseProps, Paper, Popper } from "@mui/material";
import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid-pro";
import React from "react";

export const EditCell = ({ id, field, value, colDef }: GridRenderEditCellParams<string>) => {
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
            {/* @ts-expect-error Fixed with MUI v6 (`onResize` and `onResizeCapture` props required according to TS but not actually needed) */}
            <Popper
                open={!!anchorEl}
                anchorEl={anchorEl}
                placement="bottom-start"
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
