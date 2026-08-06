import { LevelUp } from "@comet/admin-icons";
import { type ComponentsOverrides, IconButton as MuiIconButton } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import type { ReactNode } from "react";

import { Breadcrumbs, type BreadcrumbsClassKey, type BreadcrumbsSlotsMap } from "../../common/breadcrumbs/Breadcrumbs";
import { createComponentSlot } from "../../helpers/createComponentSlot";
import type { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useStackApi } from "../Api";
import { BreadcrumbLink } from "./BreadcrumbLink";

export type StackBreadcrumbsClassKey = BreadcrumbsClassKey | "backButton" | "backButtonSeparator";

const BackButton = createComponentSlot(MuiIconButton)<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "backButton",
})() as typeof MuiIconButton;

const BackButtonSeparator = createComponentSlot("div")<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "backButtonSeparator",
})(
    ({ theme }) => css`
        height: 30px;
        width: 1px;
        background-color: ${theme.palette.divider};
        margin-right: 12px;
    `,
);

export interface StackBreadcrumbsProps
    extends ThemedComponentBaseProps<
        BreadcrumbsSlotsMap & {
            backButton: typeof MuiIconButton;
            backButtonSeparator: "div";
        }
    > {
    separator?: ReactNode;
    overflowLinkText?: ReactNode;
}

export function StackBreadcrumbs(inProps: StackBreadcrumbsProps) {
    const { separator, overflowLinkText = ". . .", slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminStackBreadcrumbs" });
    const stackApi = useStackApi();

    const breadcrumbItems = stackApi?.breadCrumbs ?? [];

    if (!breadcrumbItems.length) {
        return null;
    }

    const backButtonUrl = breadcrumbItems.length > 1 ? breadcrumbItems[breadcrumbItems.length - 2].url : undefined;
    const items = breadcrumbItems.map(({ url, title }) => ({ url, title }));

    const startAdornment = backButtonUrl ? (
        <>
            {/* @ts-expect-error The component prop does not work properly with MUIs `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop */}
            <BackButton component={BreadcrumbLink} to={backButtonUrl} {...slotProps?.backButton}>
                <LevelUp />
            </BackButton>
            <BackButtonSeparator {...slotProps?.backButtonSeparator} />
        </>
    ) : undefined;

    return (
        <Breadcrumbs
            items={items}
            linkComponent={BreadcrumbLink}
            startAdornment={startAdornment}
            overflowLabel={overflowLinkText}
            iconMapping={{ separator }}
            slotProps={slotProps}
            {...restProps}
        />
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminStackBreadcrumbs: StackBreadcrumbsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminStackBreadcrumbs: StackBreadcrumbsProps;
    }

    interface Components {
        CometAdminStackBreadcrumbs?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminStackBreadcrumbs"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminStackBreadcrumbs"];
        };
    }
}
