import { ChevronDown } from "@comet/admin-icons";
import { Button, ComponentsOverrides } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { css, styled, Theme } from "@mui/material/styles";
import { useThemeProps } from "@mui/system";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";

import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */

export type FilterBarButtonClassKey = "root" | "open" | "hasDirtyFields" | "filterBadge";

type OwnerState = Pick<FilterBarButtonProps, "openPopover" | "numberDirtyFields">;

const Root = styled(Button, {
    name: "CometAdminFilterBarButton",
    slot: "root",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.root, styles.openPopover, styles.numberDirtyFields];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        position: relative;
        cursor: pointer;
        display: flex;
        background-color: ${theme.palette.common.white};
        border-color: ${theme.palette.grey[100]};
        border-radius: 2px;

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

        ${ownerState.numberDirtyFields &&
        css`
            border-color: ${theme.palette.grey[400]};
            font-weight: ${theme.typography.fontWeightBold};

            &:disabled {
                border-color: ${theme.palette.grey[100]};
            }
        `}
    `,
);

const FilterBadge = styled("span", {
    name: "CometAdminFilterBarButton",
    slot: "filterBadge",
    overridesResolver(_, styles) {
        return [styles.filterBadge];
    },
})(
    css`
        margin-left: 6px;
    `,
);

export interface FilterBarButtonProps extends ThemedComponentBaseProps<{ root: typeof Button; filterBadge: "span" }>, ButtonProps {
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    numberDirtyFields?: number;
    openPopover?: boolean;
}

export function FilterBarButtonWithStyles(inProps: FilterBarButtonProps) {
    const {
        children,
        dirtyFieldsBadge,
        numberDirtyFields,
        openPopover,
        classes,
        endIcon = <ChevronDown />,
        className,
        slotProps,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFilterBarButton",
    });

    const ownerState: OwnerState = {
        openPopover,
        numberDirtyFields,
    };

    const hasDirtyFields = !!(numberDirtyFields && numberDirtyFields > 0);
    const FilterBarActiveFilterBadgeComponent = dirtyFieldsBadge ? dirtyFieldsBadge : FilterBarActiveFilterBadge;

    return (
        <Root ownerState={ownerState} {...restProps} {...slotProps?.root} disableRipple endIcon={endIcon} variant="outlined">
            {children}
            {hasDirtyFields && (
                <FilterBadge {...slotProps?.filterBadge} {...restProps}>
                    <FilterBarActiveFilterBadgeComponent countValue={numberDirtyFields} />
                </FilterBadge>
            )}
        </Root>
    );
}

export { FilterBarButtonWithStyles as FilterBarButton };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarButton: FilterBarButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarButton: Partial<FilterBarButtonProps>;
    }

    interface Components {
        CometAdminFilterBarButton?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBarButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarButton"];
        };
    }
}
