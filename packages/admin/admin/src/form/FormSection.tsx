import { type ComponentsOverrides } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { type ComponentProps, type ReactNode } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { SectionHeadline } from "../section/SectionHeadline";

export type FormSectionClassKey = "root" | "disableMarginBottom" | "title" | "children";

type OwnerState = Pick<FormSectionProps, "disableMarginBottom">;

export interface FormSectionProps
    extends ThemedComponentBaseProps<{
        root: "div";
        title: typeof SectionHeadline;
        children: "div";
    }> {
    children: ReactNode;
    title?: ReactNode;
    disableMarginBottom?: boolean;
    infoTooltip?: ComponentProps<typeof Title>["infoTooltip"];
    /**
     * @deprecated Use `slotProps.title` for custom styling or for setting a custom `variant` on the underlying `Typography` component.
     */
    disableTypography?: boolean;
}

export function FormSection(inProps: FormSectionProps) {
    const { children, title, disableMarginBottom, disableTypography, slotProps, infoTooltip, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminFormSection",
    });

    const ownerState: OwnerState = {
        disableMarginBottom,
    };

    return (
        <Root ownerState={ownerState} {...slotProps?.root} {...restProps}>
            {title && (
                <>
                    {disableTypography ? (
                        <LegacyTitle {...slotProps?.title}>{title}</LegacyTitle>
                    ) : (
                        <Title infoTooltip={infoTooltip} divider {...slotProps?.title}>
                            {title}
                        </Title>
                    )}
                </>
            )}

            <Children {...slotProps?.children}>{children}</Children>
        </Root>
    );
}

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

const Title = createComponentSlot(SectionHeadline)<FormSectionClassKey>({
    componentName: "FormSection",
    slotName: "title",
})(
    ({ theme }) => css`
        margin-bottom: ${theme.spacing(4)};
    `,
);

// TODO: Remove this slot once the `disableTypography` prop has been removed
const LegacyTitle = createComponentSlot("div")<FormSectionClassKey>({
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
