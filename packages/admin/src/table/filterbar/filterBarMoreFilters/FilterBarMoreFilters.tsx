import { Filter } from "@comet/admin-icons";
import { ComponentsOverrides, Theme, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { FilterBarMoveFilersClassKey, styles } from "./FilterBarMoreFilters.styles";

export interface FilterBarMoreFiltersProps {
    icon?: React.ReactNode;
}

export function MoreFilters({
    children,
    icon = <Filter />,
    classes,
}: React.PropsWithChildren<FilterBarMoreFiltersProps> & WithStyles<typeof styles>): React.ReactElement {
    const [hasExtended, setHasExtended] = React.useState(false);
    if (!hasExtended) {
        return (
            <div className={classes.root} onClick={() => setHasExtended(true)}>
                {icon}
                <div className={classes.textWrapper}>
                    <Typography variant="body1">
                        <FormattedMessage id="cometAdmin.generic.moreFilter" defaultMessage="More Filter" />
                    </Typography>
                </div>
            </div>
        );
    } else {
        return <>{children}</>;
    }
}

export const FilterBarMoreFilters = withStyles(styles, { name: "CometAdminFilterBarMoreFilters" })(MoreFilters);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarMoreFilters: FilterBarMoveFilersClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarMoreFilters: FilterBarMoreFiltersProps;
    }

    interface Components {
        CometAdminFilterBarMoreFilters?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBarMoreFilters"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarMoreFilters"];
        };
    }
}
