import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

import { FilterBarSingleSelectProps, MenuItemValues } from "./FilterBarSingleSelect";

export type FilterBarSingleSelectClassKey = "root" | "wrapper" | "menu" | "menuList";

export const styles = ({ palette }: Theme) => {
    return createStyles<FilterBarSingleSelectClassKey, FilterBarSingleSelectProps<MenuItemValues>>({
        root: {
            height: "42px",
            "&:hover, &:focus": {
                borderColor: palette.primary.main,
            },
            "& .MuiSelect-iconOpen": {
                transform: "rotate(0deg)",
            },
        },
        wrapper: {
            "& .MuiInputBase-root.Mui-focused": {
                borderColor: palette.grey[400],
            },
        },
        menu: {
            "& .MuiMenuItem-root": {
                display: "flex",
                justifyContent: "space-between",
            },
        },
        menuList: {
            "& .MuiListItem-button": {
                minHeight: "39px",
                marginBottom: "1px",
                "&:last-child": {
                    marginBottom: 0,
                },
            },
            "& .MuiListItem-button.Mui-selected": {
                backgroundColor: palette.grey[50],
            },
            "& .MuiListItem-button:hover": {
                backgroundColor: palette.grey[50],
            },
        },
    });
};
