import type { ComponentsOverrides } from "@mui/material";
import { type Theme, useThemeProps } from "@mui/material/styles";
import type { ReactNode } from "react";

import type { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useStackApi } from "../../stack/Api";
import { BreadcrumbLink } from "../../stack/breadcrumbs/BreadcrumbLink";
import { Breadcrumbs, type BreadcrumbsClassKey, type BreadcrumbsSlotsMap } from "../breadcrumbs/Breadcrumbs";

export type ToolbarBreadcrumbsClassKey = BreadcrumbsClassKey;

export interface ToolbarBreadcrumbsProps extends ThemedComponentBaseProps<BreadcrumbsSlotsMap> {
    iconMapping?: {
        itemSeparator?: ReactNode;
        openMobileMenu?: ReactNode;
        closeMobileMenu?: ReactNode;
    };
}

export const ToolbarBreadcrumbs = (inProps: ToolbarBreadcrumbsProps) => {
    const { iconMapping = {}, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbarBreadcrumbs" });
    const { itemSeparator, openMobileMenu, closeMobileMenu } = iconMapping;
    const stackApi = useStackApi();

    const breadcrumbs = stackApi?.breadCrumbs ?? [];

    if (!breadcrumbs.length) {
        return null;
    }

    const items = breadcrumbs.map(({ url, title }) => ({ url, title }));

    return (
        <Breadcrumbs
            items={items}
            linkComponent={BreadcrumbLink}
            iconMapping={{ separator: itemSeparator, openMenu: openMobileMenu, closeMenu: closeMobileMenu }}
            slotProps={slotProps}
            {...restProps}
        />
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarBreadcrumbs: ToolbarBreadcrumbsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbarBreadcrumbs: ToolbarBreadcrumbsProps;
    }

    interface Components {
        CometAdminToolbarBreadcrumbs?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminToolbarBreadcrumbs"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarBreadcrumbs"];
        };
    }
}
