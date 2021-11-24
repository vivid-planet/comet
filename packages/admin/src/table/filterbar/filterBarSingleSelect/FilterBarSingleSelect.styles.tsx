import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

import { FilterBarSingleSelectProps } from "./FilterBarSingleSelect";

export type FilterBarSingleSelectClassKey = "root" | "popoverContentContainer" | "paper";

export const styles = ({ palette }: Theme) => {
    return createStyles<FilterBarSingleSelectClassKey, FilterBarSingleSelectProps>({
        root: {
            backgroundColor: palette.common.white,
            position: "relative",
            marginBottom: "10px",
            borderRadius: "2px",
            marginRight: "6px",
        },
        popoverContentContainer: {
            minWidth: 300,
        },
        paper: {
            marginLeft: -1, //due to border of popover, but now overrideable with styling if needed
            marginTop: 2, //due to boxShadow of popover to not overlap border of clickable fieldBar
        },
    });
};
