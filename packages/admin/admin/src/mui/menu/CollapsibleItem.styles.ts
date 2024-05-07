import { Typography } from "@mui/material";
import { css } from "@mui/material/styles";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { MenuItem as CometMenuItem, MenuItemLevel } from "./Item";

export type MenuCollapsibleItemClassKey = "root" | "open" | "childSelected" | "menuItem" | "itemTitle" | "collapsibleIndicator";

export type OwnerState = {
    childSelected: boolean;
    open: boolean;
    menuOpen: boolean;
    subMenuOpen: boolean;
    level: MenuItemLevel;
};

export const Root = createComponentSlot("div")<MenuCollapsibleItemClassKey, OwnerState>({
    componentName: "MenuCollapsibleItem",
    slotName: "root",
    classesResolver: (ownerState) => {
        return [ownerState.open && "open", ownerState.childSelected && "childSelected"];
    },
})(
    ({ theme, ownerState }) => css`
        ${ownerState.childSelected &&
        css`
            color: ${theme.palette.primary.main};
            font-weight: ${theme.typography.fontWeightMedium};
        `}
    `,
);

export const MenuItem = createComponentSlot(CometMenuItem)<MenuCollapsibleItemClassKey, OwnerState>({
    componentName: "MenuCollapsibleItem",
    slotName: "menuItem",
})(
    ({ theme, ownerState }) => css`
        ${ownerState.childSelected &&
        css`
            .CometAdminMenuItem-text,
            .CometAdminMenuItem-root .CometAdminMenuItem-icon {
                color: ${theme.palette.primary.main};
            }
            .CometAdminMenuItem-primary {
                ${(ownerState.level === 2 || ownerState.level === 3) &&
                css`
                    font-weight: 600;
                `};
            }
        `}
    `,
);

export const ItemTitle = createComponentSlot(Typography)<MenuCollapsibleItemClassKey>({
    componentName: "MenuCollapsibleItem",
    slotName: "itemTitle",
})(
    ({ theme }) => css`
        font-size: 12px;
        line-height: 16px;
        font-weight: 600;
        padding: 20px 15px 20px 15px;
        color: ${theme.palette.grey[500]};
    `,
);

export const CollapsibleIndicator = createComponentSlot("div")<MenuCollapsibleItemClassKey, OwnerState>({
    componentName: "MenuCollapsibleItem",
    slotName: "collapsibleIndicator",
})(
    ({ theme, ownerState }) => css`
        font-size: 16px;
        line-height: 0;
        color: ${theme.palette.grey[900]};

        ${ownerState.level === 1 &&
        !ownerState.menuOpen &&
        css`
            font-size: 12px;
            color: ${theme.palette.grey[200]};

            ${ownerState.subMenuOpen &&
            css`
                color: ${theme.palette.common.white};
            `}
        `}
    `,
);
