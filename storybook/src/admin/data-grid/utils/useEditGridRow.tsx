import { type GridColDef, StackLink, useStackSwitchApi } from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { IconButton, type IconButtonProps } from "@mui/material";
import { type GridEventListener, type GridRowId } from "@mui/x-data-grid";
import { type FC } from "react";

type EditIconButton = FC<{ id: GridRowId } & IconButtonProps>;

type UseEditGridRowReturn = {
    handleDataGridRowClick: GridEventListener<"rowClick">;
    EditIconButton: EditIconButton;
    actionsCell: GridColDef;
};

export const useEditGridRow = (): UseEditGridRowReturn => {
    const stackSwitchApi = useStackSwitchApi();

    const handleDataGridRowClick: GridEventListener<"rowClick"> = (params, event) => {
        const shouldOpenLinkInNewTab = event.ctrlKey || event.metaKey;

        if (shouldOpenLinkInNewTab) {
            const url = stackSwitchApi.getTargetUrl("edit", params.row.id);
            window.open(url, "_blank");
            return;
        }

        stackSwitchApi.activatePage("edit", params.row.id);
    };

    const EditIconButton: EditIconButton = ({ id, children = <Edit />, ...restIconButtonProps }) => (
        <IconButton color="primary" component={StackLink} pageName="edit" payload={id.toString()} aria-label="Edit" {...restIconButtonProps}>
            {children}
        </IconButton>
    );

    const actionsCell: GridColDef = {
        field: "actions",
        type: "actions",
        headerName: "",
        width: 52,
        renderCell: (params) => <EditIconButton id={params.row.id} />,
    };

    return {
        handleDataGridRowClick,
        EditIconButton,
        actionsCell,
    };
};
