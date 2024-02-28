import { ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type MainContentClassKey = "root" | "disablePaddingTop" | "disablePaddingBottom" | "disablePadding" | "fullHeight";

type OwnerState = Pick<MainContentProps, "disablePaddingTop" | "disablePaddingBottom" | "disablePadding" | "fullHeight"> & {
    topPosition: number;
};

const Root = styled("main", {
    name: "CometAdminMainContent",
    slot: "root",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [
            styles.root,
            ownerState.disablePaddingTop && styles.disablePaddingTop,
            ownerState.disablePaddingBottom && styles.disablePaddingBottom,
            ownerState.disablePadding && styles.disablePadding,
            ownerState.fullHeight && styles.fullHeight,
        ];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        position: relative;
        z-index: 5;
        padding: ${theme.spacing(4)};

        ${ownerState.fullHeight &&
        css`
            height: calc(100vh - ${ownerState.topPosition}px);
        `}

        ${ownerState.disablePaddingTop &&
        css`
            padding-top: 0;
        `}

        ${ownerState.disablePaddingBottom &&
        css`
            padding-bottom: 0;
        `}

        ${ownerState.disablePadding &&
        css`
            padding: 0;
        `}
    `,
);

export interface MainContentProps extends ThemedComponentBaseProps {
    children?: React.ReactNode;
    disablePaddingTop?: boolean;
    disablePaddingBottom?: boolean;
    disablePadding?: boolean;
    fullHeight?: boolean;
}

export function MainContent(inProps: MainContentProps) {
    const { children, fullHeight, disablePaddingTop, disablePaddingBottom, disablePadding, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminMainContent",
    });

    const mainRef = React.useRef<HTMLElement>(null);
    const topPosition = fullHeight && mainRef.current ? mainRef.current.offsetTop : 0;

    const ownerState: OwnerState = {
        fullHeight,
        disablePaddingTop,
        disablePaddingBottom,
        disablePadding,
        topPosition,
    };

    return (
        <Root ownerState={ownerState} {...restProps} ref={mainRef}>
            {children}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMainContent: MainContentClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMainContent: Partial<MainContentProps>;
    }

    interface Components {
        CometAdminMainContent?: {
            defaultProps?: ComponentsPropsList["CometAdminMainContent"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMainContent"];
        };
    }
}
