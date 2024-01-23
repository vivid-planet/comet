import { ComponentsOverrides, Typography } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export type FilterBarActiveFilterBadgeClassKey = "hasValueCount";

const HasValueCount = styled("div", {
    name: "CometAdminFilterBarActiveFilterBadge",
    slot: "hasValueCount",
    overridesResolver(_, styles) {
        return [styles.hasValueCount];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        background-color: ${theme.palette.grey[100]};
        box-sizing: border-box;
        text-align: center;
        border-radius: 4px;
        padding: 4px 5px;
        margin-top: -4px;
        margin-bottom: -4px;
        font-size: 12px;
    `,
);

export interface FilterBarActiveFilterBadgeProps extends ThemedComponentBaseProps<{ hasValueCount: "div" }> {
    countValue: number;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export function FilterBarActiveFilterBadge(inProps: FilterBarActiveFilterBadgeProps) {
    const { countValue, slotProps, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminFilterBarActiveFilterBadge",
    });
    if (countValue > 0) {
        return (
            <HasValueCount {...slotProps?.hasValueCount} {...restProps}>
                <Typography variant="inherit" display="block">
                    {countValue}
                </Typography>
            </HasValueCount>
        );
    } else {
        return null;
    }
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarActiveFilterBadge: FilterBarActiveFilterBadgeClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarActiveFilterBadge: Partial<FilterBarActiveFilterBadgeProps>;
    }

    interface Components {
        CometAdminFilterBarActiveFilterBadge?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBarActiveFilterBadge"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarActiveFilterBadge"];
        };
    }
}
