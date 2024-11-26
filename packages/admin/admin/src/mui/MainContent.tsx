import { ComponentsOverrides, css, Theme, useThemeProps } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { useIsActiveStackSwitch } from "../stack/useIsActiveStackSwitch";

export type MainContentClassKey = "root" | "disablePaddingTop" | "disablePaddingBottom" | "disablePadding" | "fullHeight";

type OwnerState = Pick<MainContentProps, "disablePaddingTop" | "disablePaddingBottom" | "disablePadding" | "fullHeight"> & {
    topOffset: number;
};

const Root = createComponentSlot("main")<MainContentClassKey, OwnerState>({
    componentName: "MainContent",
    slotName: "root",
    classesResolver(ownerState) {
        return [
            ownerState.disablePaddingTop && "disablePaddingTop",
            ownerState.disablePaddingBottom && "disablePaddingBottom",
            ownerState.disablePadding && "disablePadding",
            ownerState.fullHeight && "fullHeight",
        ];
    },
})(
    ({ theme, ownerState }) => css`
        position: relative;
        z-index: 5;
        padding: ${theme.spacing(4)};

        ${ownerState.fullHeight &&
        css`
            height: calc(100vh - ${ownerState.topOffset}px);
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
    children?: ReactNode;
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
    const mainRef = useRef<HTMLElement>(null);
    const [topOffset, setTopOffset] = useState(0);

    useEffect(() => {
        if (mainRef.current) {
            setTopOffset(mainRef.current.offsetTop);
        }
    }, []);

    const ownerState: OwnerState = {
        fullHeight,
        disablePaddingTop,
        disablePaddingBottom,
        disablePadding,
        topOffset,
    };

    return (
        <Root ownerState={ownerState} ref={mainRef} {...restProps}>
            {children}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMainContent: MainContentClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMainContent: MainContentProps;
    }

    interface Components {
        CometAdminMainContent?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMainContent"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMainContent"];
        };
    }
}

export const StackMainContent = ({ children, ...props }: MainContentProps) => {
    const isActiveStackSwitch = useIsActiveStackSwitch();

    // When inside a Stack, only the last MainContent should add content-spacing and height
    if (!isActiveStackSwitch) {
        return <>{children}</>;
    }

    return <MainContent {...props}>{children}</MainContent>;
};
