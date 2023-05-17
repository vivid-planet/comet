import { Theme } from "@mui/material/styles";
import { createStyles } from "@mui/styles";

import { FilterBarMoreFiltersProps } from "./FilterBarMoreFilters";

export type FilterBarMoveFilersClassKey = "root" | "button";

export const styles = ({ typography }: Theme) => {
    return createStyles<FilterBarMoveFilersClassKey, FilterBarMoreFiltersProps>({
        root: {
            marginBottom: 10,
            marginRight: 6,
        },
        button: {
            fontWeight: typography.fontWeightBold,
        },
    });
};
