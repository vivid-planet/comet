import { Theme } from "@mui/material/styles";
import { createStyles } from "@mui/styles";

import { FilterBarMoreFiltersProps } from "./FilterBarMoreFilters";

export type FilterBarMoveFilersClassKey = "root" | "textWrapper";

export const styles = ({ palette, typography }: Theme) => {
    return createStyles<FilterBarMoveFilersClassKey, FilterBarMoreFiltersProps>({
        root: {
            backgroundColor: palette.common.white,
            border: `1px solid ${palette.grey[300]}`,
            justifyContent: "center",
            padding: "10px 15px",
            position: "relative",
            marginBottom: "10px",
            alignItems: "center",
            marginRight: "10px",
            borderRadius: "2px",
            cursor: "pointer",
            display: "flex",

            "& [class*='MuiSvgIcon-root']": {
                fontSize: 12,
            },
        },
        textWrapper: {
            marginLeft: "15px",

            "& [class*='MuiTypography-body1']": {
                fontWeight: typography.fontWeightBold,
            },
        },
    });
};
