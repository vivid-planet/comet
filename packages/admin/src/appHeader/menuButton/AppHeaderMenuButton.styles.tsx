import { IconButtonClassKey } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

import { AppHeaderMenuButtonThemeProps } from "./AppHeaderMenuButton";

export type CometAdminAppHeaderMenuButtonClassKeys = IconButtonClassKey;

export const useStyles = makeStyles<Theme, {}, CometAdminAppHeaderMenuButtonClassKeys>(
    ({ spacing }) => ({
        root: {
            color: "#fff",
            marginLeft: spacing(2),
            marginRight: spacing(2),
        },
        edgeStart: {},
        edgeEnd: {},
        colorInherit: {},
        colorPrimary: {},
        colorSecondary: {},
        disabled: {},
        sizeSmall: {},
        label: {},
    }),
    { name: "CometAdminAppHeaderMenuButton" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderMenuButton: CometAdminAppHeaderMenuButtonClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminAppHeaderMenuButton: AppHeaderMenuButtonThemeProps;
    }
}
