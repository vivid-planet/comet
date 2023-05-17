import { Theme } from "@mui/material/styles";
import { createStyles } from "@mui/styles";

import { FilterBarActiveFilterBadgeProps } from "./FilterBarActiveFilterBadge";

export type FilterBarActiveFilterBadgeClassKey = "hasValueCount";

export const styles = ({ palette }: Theme) => {
    return createStyles<FilterBarActiveFilterBadgeClassKey, FilterBarActiveFilterBadgeProps>({
        hasValueCount: {
            display: "flex",
            alignItems: "center",
            backgroundColor: palette.grey[100],
            boxSizing: "border-box",
            textAlign: "center",
            borderRadius: "4px",
            padding: "4px 5px",
            marginTop: -4,
            marginBottom: -4,
            fontSize: "12px",
        },
    });
};
