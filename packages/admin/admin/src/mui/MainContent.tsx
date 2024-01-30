import { ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

export type MainContentClassKey = "root" | "disablePaddingTop" | "disablePaddingBottom" | "disablePadding" | "fullHeight";

type OwnerState = Pick<MainContentProps, "disablePaddingTop" | "disablePaddingBottom" | "disablePadding" | "fullHeight">;

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
            height: calc(100vh - var(--comet-admin-main-content-top-position));
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

export interface MainContentProps {
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
    };

    return (
        <Root
            ownerState={ownerState}
            {...restProps}
            ref={mainRef}
            style={{ "--comet-admin-main-content-top-position": `${topPosition}px` } as React.CSSProperties}
        >
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
