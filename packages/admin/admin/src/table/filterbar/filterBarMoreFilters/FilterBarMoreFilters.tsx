import { Filter } from "@comet/admin-icons";
import { ComponentsOverrides, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { FilterBarButton } from "../filterBarButton/FilterBarButton";
import { FilterBarMoveFilersClassKey, styles } from "./FilterBarMoreFilters.styles";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface FilterBarMoreFiltersProps {
    icon?: React.ReactNode;
}

export function MoreFilters({
    children,
    icon = <Filter />,
    classes,
}: React.PropsWithChildren<FilterBarMoreFiltersProps> & WithStyles<typeof styles>): React.ReactElement {
    const [hasExtended, setHasExtended] = React.useState(false);

    if (hasExtended) {
        return <>{children}</>;
    }

    return (
        <div className={classes.root}>
            <FilterBarButton className={classes.button} onClick={() => setHasExtended(true)} startIcon={icon} endIcon={null}>
                <FormattedMessage id="comet.filterbar.moreFilter" defaultMessage="More Filter" />
            </FilterBarButton>
        </div>
    );
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export const FilterBarMoreFilters = withStyles(styles, { name: "CometAdminFilterBarMoreFilters" })(MoreFilters);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarMoreFilters: FilterBarMoveFilersClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarMoreFilters: Partial<FilterBarMoreFiltersProps>;
    }

    interface Components {
        CometAdminFilterBarMoreFilters?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBarMoreFilters"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarMoreFilters"];
        };
    }
}
