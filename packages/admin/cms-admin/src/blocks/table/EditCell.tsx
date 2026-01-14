import { InputBase, type InputBaseProps, Paper, Popper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid-pro";
import { useCallback, useState } from "react";

export const EditCell = ({ id, field, value, colDef }: GridRenderEditCellParams) => {
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
        <Root>
            <EditCellHandle ref={handleRef} />
            <EditPopper open={!!anchorEl} anchorEl={anchorEl} placement="bottom-start">
                <EditPaper elevation={1}>
                    <EditInput
                        multiline
                        value={valueState}
                        columnWidth={colDef.computedWidth}
                        onChange={handleChange}
                        autoFocus
                        onKeyDown={handleKeyDown}
                    />
                </EditPaper>
            </EditPopper>
        </Root>
    );
};

const Root = styled("div")({
    position: "relative",
});

const EditCellHandle = styled("div")({
    position: "absolute",
    top: 0,
});

const EditPopper = styled(Popper)(({ theme }) => ({
    zIndex: theme.zIndex.modal + 1, // Make sure the edit-cell Popper is above the Dialog with DataGrid
}));

const EditPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
}));

const EditInput = styled(InputBase, { shouldForwardProp: (prop) => prop !== "columnWidth" })<{ columnWidth: number }>(({ theme, columnWidth }) => ({
    width: "100%",
    height: "100%",

    textarea: {
        resize: "both",
        minHeight: `calc(55px - ${theme.spacing(2)})`,
        minWidth: `calc(${columnWidth}px - ${theme.spacing(2)})`,
        boxSizing: "border-box",
    },
}));
