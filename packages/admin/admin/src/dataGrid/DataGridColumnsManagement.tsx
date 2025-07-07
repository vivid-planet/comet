// MUI's implementation: https://github.com/mui/mui-x/blob/v7.x/packages/x-data-grid/src/components/columnsManagement/GridColumnsManagement.tsx
import {
    type ComponentsOverrides,
    type List as MuiList,
    type ListItem as MuiListItem,
    type Switch as MuiSwitch,
    type Theme,
    type Typography,
    useThemeProps,
} from "@mui/material";
import { gridColumnVisibilityModelSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid-pro";
import { type ChangeEvent } from "react";

import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { Body, List, ListItem, ListItemTitle, Root, Switch } from "./DataGridColumnsManagement.sc";

export type DataGridColumnsManagementProps = ThemedComponentBaseProps<{
    root: "div";
    body: "div";
    switch: typeof MuiSwitch;
    list: typeof MuiList;
    listItem: typeof MuiListItem;
    listItemTitle: typeof Typography;
}>;

export type DataGridColumnsManagementClassKey = "root" | "body" | "list" | "listItem" | "switch" | "listItemTitle";

export const DataGridColumnsManagement = (inProps: DataGridColumnsManagementProps) => {
    const { sx, className, slotProps = {} } = useThemeProps({ props: inProps, name: "CometAdminDataGridColumnsManagement" });

    const apiRef = useGridApiContext();
    const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
    const columns = apiRef.current.getAllColumns();

    const toggleColumn = (event: ChangeEvent<HTMLInputElement>) => {
        const { name: field } = event.target;
        const column = columns.find((value) => value.field === field);
        if (column?.hideable) {
            const isCurrentlyVisible = columnVisibilityModel[field] !== false;

            const newVisibilityModel = {
                ...columnVisibilityModel,
                [field]: !isCurrentlyVisible,
            };

            apiRef.current.setColumnVisibilityModel(newVisibilityModel);
        }
    };

    return (
        <Root sx={sx} className={className} {...slotProps.root}>
            <Body {...slotProps.body}>
                <List {...slotProps.list}>
                    {columns.map((column, index) => {
                        const checked = columnVisibilityModel?.[column.field] ?? true;
                        return (
                            <ListItem key={index} {...slotProps.listItem}>
                                <Switch
                                    name={column.field}
                                    checked={checked}
                                    onChange={toggleColumn}
                                    disabled={!column.hideable}
                                    {...slotProps.switch}
                                />
                                <ListItemTitle variant={checked ? "subtitle2" : "body2"} {...slotProps.listItemTitle}>
                                    {column.headerName || column.field}
                                </ListItemTitle>
                            </ListItem>
                        );
                    })}
                </List>
            </Body>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDataGridColumnsManagement: DataGridColumnsManagementProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDataGridColumnsManagement: DataGridColumnsManagementClassKey;
    }

    interface Components {
        CometAdminDataGridColumnsManagement?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDataGridColumnsManagement"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDataGridColumnsManagement"];
        };
    }
}
