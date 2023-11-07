import { ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export type FilterBarClassKey = "root" | "barWrapper";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
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

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export const FilterBar = withStyles(styles, { name: "CometAdminFilterBar" })(Bar);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBar: FilterBarClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBar: Partial<FilterBarProps>;
    }

    interface Components {
        CometAdminFilterBar?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBar"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBar"];
        };
    }
}
