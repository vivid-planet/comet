import { Filter } from "@comet/admin-icons";
import { Typography } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./FilterBarMoreFilters.styles";

export interface FilterBarMoreFiltersProps {}

export function FilterBarMoreFilters({ children }: React.PropsWithChildren<FilterBarMoreFiltersProps>) {
    const [hasExtended, setHasExtended] = React.useState(false);
    const classes = useStyles();
    if (!hasExtended) {
        return (
            <div className={classes.showMoreWrapper} onClick={() => setHasExtended(true)}>
                <Filter />
                <div className={classes.showMoreTextWrapper}>
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
