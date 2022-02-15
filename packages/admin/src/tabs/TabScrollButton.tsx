import { ChevronLeft, ChevronRight } from "@comet/admin-icons";
import { ButtonBase, TabScrollButtonClassKey as MuiTabScrollButtonClassKey, TabScrollButtonProps as MuiTabScrollButtonProps } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export type TabScrollButtonClassKey = MuiTabScrollButtonClassKey;

export interface TabScrollButtonProps extends MuiTabScrollButtonProps {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const styles = () => {
    return createStyles<TabScrollButtonClassKey, TabScrollButtonProps>({
        root: {
            width: 40,
            flexShrink: 0,
        },
        vertical: {
            width: "100%",
            height: 40,
        },
        disabled: {},
    });
};

function ScrollButton({ orientation, direction, disabled, onClick, classes }: TabScrollButtonProps & WithStyles<typeof styles>) {
    const rootClasses: string[] = [classes.root];
    if (orientation === "vertical") rootClasses.push(classes.vertical);
    if (disabled) rootClasses.push(classes.disabled);

    return (
        <ButtonBase classes={{ root: rootClasses.join(" ") }} disabled={disabled} onClick={onClick}>
            <>{direction === "left" ? <ChevronLeft /> : <ChevronRight />}</>
        </ButtonBase>
    );
}

export const TabScrollButton = withStyles(styles, { name: "TabScrollButton" })(ScrollButton);

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        TabScrollButton: TabScrollButtonClassKey;
    }
}

declare module "@mui/material/styles/props" {
    interface ComponentsPropsList {
        CometAdminTabScrollButton: TabScrollButtonProps;
    }
}
