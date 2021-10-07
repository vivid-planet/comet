import { WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export type FilterBarClassKey = "root" | "barWrapper";

export interface FilterBarProps {
    children?: React.ReactNode;
}

const styles = () => {
    return createStyles<FilterBarClassKey, FilterBarProps>({
        root: {
            "& [class*='CometAdminFormFieldContainer-root']": {
                marginBottom: 0,
            },
        },
        barWrapper: {
            flexWrap: "wrap",
            display: "flex",
        },
    });
};

function Bar({ children, classes }: FilterBarProps & WithStyles<typeof styles>): React.ReactElement {
    return (
        <div className={classes.root}>
            <div className={classes.barWrapper}>{children}</div>
        </div>
    );
}

export const FilterBar = withStyles(styles, { name: "CometAdminFilterBar" })(Bar);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFilterBar: FilterBarClassKey;
    }
}
declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFilterBar: FilterBarProps;
    }
}
