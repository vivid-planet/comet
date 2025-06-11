import { css, IconButton, List as MuiList, ListItem as MuiListItem, ListItemText, Switch as MuiSwitch } from "@mui/material";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type DataGridColumnsManagementClassKey } from "./DataGridColumnsManagement";

export const Root = createComponentSlot("div")<DataGridColumnsManagementClassKey>({
    componentName: "DataGridColumnsManagement",
    slotName: "root",
})();

export const List = createComponentSlot(MuiList)<DataGridColumnsManagementClassKey>({
    componentName: "DataGridColumnsManagement",
    slotName: "list",
})();

export const ListItem = createComponentSlot(MuiListItem)<DataGridColumnsManagementClassKey>({
    componentName: "DataGridColumnsManagement",
    slotName: "listItem",
})(css`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
`);

export const Switch = createComponentSlot(MuiSwitch)<DataGridColumnsManagementClassKey>({
    componentName: "DataGridColumnsManagement",
    slotName: "switch",
})();

export const ListItemTitle = createComponentSlot(ListItemText)<DataGridColumnsManagementClassKey>({
    componentName: "DataGridColumnsManagement",
    slotName: "listItemTitle",
})();

export const Body = createComponentSlot("div")<DataGridColumnsManagementClassKey>({
    componentName: "DataGridColumnsManagement",
    slotName: "body",
})(
    ({ theme }) => css`
        padding: ${theme.spacing(2)};
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex: 1 1;
        max-height: 400px;
        align-items: flex-start;
    `,
);

type PinnedIconStyleProps = {
    active: boolean;
};

export const PinnedIconButton = createComponentSlot(IconButton)<DataGridColumnsManagementClassKey, PinnedIconStyleProps>({
    componentName: "DataGridColumnsManagement",
    slotName: "pinnedButton",
})(
    ({ theme, ownerState }) => css`
        color: ${ownerState.active ? theme.palette.primary.main : theme.palette.grey["200"]};
    `,
);
