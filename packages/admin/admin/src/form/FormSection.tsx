import { type ComponentsOverrides, Typography } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { type ReactNode } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type FormSectionClassKey = "root" | "disableMarginBottom" | "title" | "children";

type OwnerState = Pick<FormSectionProps, "disableMarginBottom">;

const Root = createComponentSlot("div")<FormSectionClassKey, OwnerState>({
    componentName: "FormSection",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.disableMarginBottom && "disableMarginBottom"];
    },
})(
    ({ theme, ownerState }) => css`
        ${!ownerState.disableMarginBottom &&
        css`
            margin-bottom: ${theme.spacing(12)};
        `}
    `,
);

const Title = createComponentSlot("div")<FormSectionClassKey>({
    componentName: "FormSection",
    slotName: "title",
})(
    ({ theme }) => css`
        margin-bottom: ${theme.spacing(4)};
    `,
);

const Children = createComponentSlot("div")<FormSectionClassKey>({
    componentName: "FormSection",
    slotName: "children",
})();

export interface FormSectionProps
    extends ThemedComponentBaseProps<{
        root: "div";
        title: "div";
        children: "div";
    }> {
    children: ReactNode;
    title?: ReactNode;
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
        CometAdminFormSection: FormSectionProps;
    }

    interface Components {
        CometAdminFormSection?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFormSection"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFormSection"];
        };
    }
}
