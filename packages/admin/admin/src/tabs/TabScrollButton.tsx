import { ChevronLeft, ChevronRight } from "@comet/admin-icons";
import { ButtonBase, ButtonBaseProps, ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import isMobile from "is-mobile";
import * as React from "react";

export type TabScrollButtonClassKey = "root" | "vertical";

type OwnerState = Pick<TabScrollButtonProps, "orientation">;

const Root = styled(ButtonBase, {
    name: "CometAdminTabScrollButton",
    slot: "root",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.root, ownerState.orientation === "vertical" && styles.vertical];
    },
})<{ ownerState: OwnerState }>(
    ({ ownerState }) => css`
        width: 40px;
        flex-shrink: 0;

        ${ownerState.orientation === "vertical" &&
        css`
            width: 100%;
            height: 40px;
        `}

        &:disabled {
            opacity: 0.25;
        }
    `,
);

export interface TabScrollButtonProps extends ButtonBaseProps {
    orientation: "horizontal" | "vertical";
    direction: "left" | "right";
}

export function TabScrollButton(inProps: TabScrollButtonProps) {
    const { orientation, direction, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminTabScrollButton",
    });

    const ownerState: OwnerState = {
        orientation,
    };

    return !isMobile({ tablet: true }) ? (
        <Root ownerState={ownerState} {...restProps}>
            <>{direction === "left" ? <ChevronLeft /> : <ChevronRight />}</>
        </Root>
    ) : null;
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminTabScrollButton: TabScrollButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminTabScrollButton: Partial<TabScrollButtonProps>;
    }

    interface Components {
        CometAdminTabScrollButton?: {
            defaultProps?: ComponentsPropsList["CometAdminTabScrollButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTabScrollButton"];
        };
    }
}
