import { ComponentsOverrides, css, Theme, Typography, useThemeProps } from "@mui/material";
import React from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type GridCellTextClassKey = "root" | "hasSecondaryText" | "primaryText" | "secondaryText";

export interface GridCellTextProps
    extends ThemedComponentBaseProps<{
        root: "div";
        primaryText: typeof Typography;
        secondaryText: typeof Typography;
    }> {
    primary?: React.ReactNode;
    secondary?: React.ReactNode;
    children?: React.ReactNode;
}

type OwnerState = {
    hasSecondaryText: boolean;
};

export const GridCellText = (inProps: GridCellTextProps) => {
    const { children, primary, secondary, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminGridCellText" });

    const ownerState: OwnerState = {
        hasSecondaryText: Boolean(secondary),
    };

    return (
        <Root ownerState={ownerState} {...slotProps?.root} {...restProps}>
            <PrimaryText ownerState={ownerState} {...slotProps?.primaryText}>
                {primary ? primary : children}
            </PrimaryText>
            {ownerState.hasSecondaryText && <SecondaryText {...slotProps?.secondaryText}>{secondary}</SecondaryText>}
        </Root>
    );
};

const Root = createComponentSlot("div")<GridCellTextClassKey, OwnerState>({
    componentName: "GridCellText",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.hasSecondaryText && "hasSecondaryText"];
    },
})(css`
    overflow: hidden;
`);

const ellipsisStyles = css`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const PrimaryText = createComponentSlot(Typography)<GridCellTextClassKey, OwnerState>({
    componentName: "GridCellText",
    slotName: "primaryText",
})(
    ({ theme, ownerState }) => css`
        color: ${theme.palette.grey[800]};
        font-size: 12px;
        font-weight: ${ownerState.hasSecondaryText ? 400 : 300};
        line-height: 16px;
        ${ellipsisStyles}

        ${theme.breakpoints.up("md")} {
            font-size: 14px;
            line-height: 20px;
        }
    `,
);

const SecondaryText = createComponentSlot(Typography)<GridCellTextClassKey>({
    componentName: "GridCellText",
    slotName: "secondaryText",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[300]};
        font-size: 10px;
        font-weight: 400;
        line-height: 16px;
        ${ellipsisStyles}

        ${theme.breakpoints.up("md")} {
            font-size: 12px;
        }
    `,
);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminGridCellText: GridCellTextProps;
    }

    interface ComponentNameToClassKey {
        CometAdminGridCellText: GridCellTextClassKey;
    }

    interface Components {
        CometAdminGridCellText?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminGridCellText"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminGridCellText"];
        };
    }
}
