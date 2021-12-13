import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

import { FilterBarSingleSelectProps } from "./FilterBarSingleSelect";

export type FilterBarSingleSelectClassKey = "root" | "wrapper" | "menu";

export const styles = ({ palette }: Theme) => {
    return createStyles<FilterBarSingleSelectClassKey, FilterBarSingleSelectProps>({
        root: {
            height: "42px",
            "&:hover, &:focus": {
                borderColor: palette.primary.main,
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
