import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

import { FilterBarSingleSelectProps, MenuItemValues } from "./FilterBarSingleSelect";

export type FilterBarSingleSelectClassKey = "root" | "wrapper" | "menu";

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
            "& .MuiListItem-root.Mui-selected": {
                backgroundColor: palette.grey[50],
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
    });
};
