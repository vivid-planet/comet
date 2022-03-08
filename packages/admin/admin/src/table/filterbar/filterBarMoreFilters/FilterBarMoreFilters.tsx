import { Filter } from "@comet/admin-icons";
import { Typography, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
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

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarMoreFilters: FilterBarMoveFilersClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFilterBarMoreFilters: FilterBarMoreFiltersProps;
    }
}
