import { ComponentsOverrides, Typography } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type FormSectionClassKey = "root" | "disableMarginBottom" | "title" | "children";

type OwnerState = Pick<FormSectionProps, "disableMarginBottom">;

const Root = styled("div", {
    name: "CometAdminFormSection",
    slot: "root",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.root, ownerState.disableMarginBottom && styles.disableMarginBottom];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        ${!ownerState.disableMarginBottom &&
        css`
            margin-bottom: ${theme.spacing(12)};
        `}
    `,
);

const Title = styled("div", {
    name: "CometAdminFormSection",
    slot: "title",
    overridesResolver(_, styles) {
        return [styles.title];
    },
})(
    ({ theme }) => css`
        margin-bottom: ${theme.spacing(4)};
    `,
);

const Children = styled("div", {
    name: "CometAdminFormSection",
    slot: "children",
    overridesResolver(_, styles) {
        return [styles.children];
    },
})(css``);

export interface FormSectionProps
    extends ThemedComponentBaseProps<{
        root: "div";
        title: "div";
        children: "div";
    }> {
    children: React.ReactNode;
    title?: React.ReactNode;
    disableMarginBottom?: boolean;
    disableTypography?: boolean;
}

export function FormSection(inProps: FormSectionProps) {
    const { children, title, disableMarginBottom, disableTypography, slotProps, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminFormSection",
    });

    const ownerState: OwnerState = {
        disableMarginBottom,
    };

    return (
        <Root ownerState={ownerState} {...slotProps?.root} {...restProps}>
            {title && <Title {...slotProps?.title}>{disableTypography ? title : <Typography variant="h3">{title}</Typography>}</Title>}
            <Children {...slotProps?.children}>{children}</Children>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFormSection: FormSectionClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFormSection: Partial<FormSectionProps>;
    }

    interface Components {
        CometAdminFormSection?: {
            defaultProps?: ComponentsPropsList["CometAdminFormSection"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFormSection"];
        };
    }
}
