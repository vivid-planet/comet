import { ChevronDown } from "@comet/admin-icons";
import { buttonClasses, ButtonProps, ComponentsOverrides, svgIconClasses } from "@mui/material";
import Button from "@mui/material/Button";
import { css, Theme } from "@mui/material/styles";
import { useThemeProps } from "@mui/system";
import * as React from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export type FilterBarButtonClassKey = "root" | "open" | "hasDirtyFields" | "filterBadge";

type OwnerState = { hasDirtyFields: boolean; openPopover: boolean | undefined };

const Root = createComponentSlot(Button)<FilterBarButtonClassKey, OwnerState>({
    componentName: "FilterBarButton",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.openPopover && "open", ownerState.hasDirtyFields && "hasDirtyFields"];
    },
})(
    ({ theme, ownerState }) => css`
        position: relative;
        cursor: pointer;
        display: flex;
        background-color: ${theme.palette.common.white};
        border-color: ${theme.palette.grey[100]};
        border-radius: 2px;

        && .${buttonClasses.startIcon} .${svgIconClasses.root}, && .${buttonClasses.endIcon} .${svgIconClasses.root} {
            font-size: 12px;
        }

        &:hover {
            border-color: ${theme.palette.grey[100]};
            background-color: ${theme.palette.common.white};
        }

        &:focus {
            border-color: ${theme.palette.primary.main};
            background-color: ${theme.palette.common.white};
        }

        ${ownerState.openPopover &&
        css`
            border-color: ${theme.palette.primary.main};
        `}

        ${ownerState.hasDirtyFields &&
        css`
            border-color: ${theme.palette.grey[400]};
            font-weight: ${theme.typography.fontWeightBold};

            &:disabled {
                border-color: ${theme.palette.grey[100]};
            }
        `}
    `,
);

const FilterBadge = createComponentSlot("span")<FilterBarButtonClassKey>({
    componentName: "FilterBarButton",
    slotName: "filterBadge",
})(css`
    margin-left: 6px;
`);

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface FilterBarButtonProps
    extends ThemedComponentBaseProps<{
            root: typeof Button;
            filterBadge: "span";
        }>,
        ButtonProps {
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    numberDirtyFields?: number;
    openPopover?: boolean;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export function FilterBarButton(inProps: FilterBarButtonProps) {
    const {
        children,
        dirtyFieldsBadge,
        numberDirtyFields,
        openPopover,
        endIcon = <ChevronDown />,
        slotProps,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFilterBarButton",
    });

    const hasDirtyFields = !!(numberDirtyFields && numberDirtyFields > 0);
    const FilterBarActiveFilterBadgeComponent = dirtyFieldsBadge ? dirtyFieldsBadge : FilterBarActiveFilterBadge;

    const ownerState: OwnerState = { hasDirtyFields, openPopover };

    return (
        <Root ownerState={ownerState} disableRipple endIcon={endIcon} variant="outlined" {...slotProps?.root} {...restProps}>
            {children}
            {hasDirtyFields && (
                <FilterBadge {...slotProps?.filterBadge}>
                    <FilterBarActiveFilterBadgeComponent countValue={numberDirtyFields} />
                </FilterBadge>
            )}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarButton: FilterBarButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarButton: FilterBarButtonProps;
    }

    interface Components {
        CometAdminFilterBarButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFilterBarButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarButton"];
        };
    }
}
