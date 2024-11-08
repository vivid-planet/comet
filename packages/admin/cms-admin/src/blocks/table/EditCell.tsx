import { InputBase, InputBaseProps, Paper, Popper, styled } from "@mui/material";
import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid-pro";
import { useCallback, useState } from "react";

export const EditCell = ({ id, field, value, colDef }: GridRenderEditCellParams<string>) => {
    const [valueState, setValueState] = useState(value);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
    const apiRef = useGridApiContext();

    const handleRef = useCallback((el: HTMLElement | null) => {
        setAnchorEl(el);
    }, []);

    const handleChange = useCallback<NonNullable<InputBaseProps["onChange"]>>(
        (event) => {
            const newValue = event.target.value;
            setValueState(newValue);
            apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 }, event);
        },
        [apiRef, field, id],
    );

    const handleKeyDown = useCallback<NonNullable<InputBaseProps["onKeyDown"]>>(
        (event) => {
            if (event.key === "Escape" || (event.key === "Enter" && !event.shiftKey && (event.ctrlKey || event.metaKey))) {
                const params = apiRef.current.getCellParams(id, field);
                apiRef.current.publishEvent("cellKeyDown", params, event);
            }
        },
        [apiRef, id, field],
    );

    return (
        <div>
            <EditCellHandle
                ref={handleRef}
                style={
                    {
                        // width: colDef.computedWidth,
                    }
                }
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
                <EditPaper elevation={1}>
                    <EditInput
                        multiline
                        value={valueState}
                        $columnWidth={colDef.computedWidth}
                        onChange={handleChange}
                        autoFocus
                        onKeyDown={handleKeyDown}
                    />
                </EditPaper>
            </Popper>
        </div>
    );
};

const EditCellHandle = styled("div")({
    position: "absolute",
    top: 0,
});

const EditPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
}));

const EditInput = styled(InputBase)<{ $columnWidth: number }>(({ theme, $columnWidth }) => ({
    width: "100%",
    height: "100%",

    // TODO: Can this be a separate SC?
    textarea: {
        resize: "both",
        minHeight: `calc(55px - ${theme.spacing(2)})`,
        minWidth: `calc(${$columnWidth}px - ${theme.spacing(2)})`,
        boxSizing: "border-box",
    },
}));
