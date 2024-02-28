import { Filter } from "@comet/admin-icons";
import { ComponentsOverrides } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { FilterBarButton } from "../filterBarButton/FilterBarButton";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export type FilterBarMoreFiltersClassKey = "root" | "button";

const Root = styled("div", {
    name: "CometAdminFilterBarMoreFilters",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    margin-bottom: 10px;
    margin-right: 6px;
`);

const StyledFilterBarButton = styled(FilterBarButton, {
    name: "CometAdminFilterBarMoreFilters",
    slot: "button",
    overridesResolver(_, styles) {
        return [styles.button];
    },
})(
    ({ theme }) => css`
        font-weight: ${theme.typography.fontWeightBold};
    `,
);

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface FilterBarMoreFiltersProps
    extends ThemedComponentBaseProps<{
        root: "div";
        button: typeof FilterBarButton;
    }> {
    icon?: React.ReactNode;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export function FilterBarMoreFilters(inProps: React.PropsWithChildren<FilterBarMoreFiltersProps>) {
    const {
        children,
        icon = <Filter />,
        slotProps,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFilterBarMoreFilters",
    });
    const [hasExtended, setHasExtended] = React.useState(false);

    if (hasExtended) {
        return <>{children}</>;
    }

    return (
        <Root {...slotProps?.root} {...restProps}>
            <StyledFilterBarButton {...slotProps?.button} onClick={() => setHasExtended(true)} startIcon={icon} endIcon={null}>
                <FormattedMessage id="comet.filterbar.moreFilter" defaultMessage="More Filter" />
            </StyledFilterBarButton>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarMoreFilters: FilterBarMoreFiltersClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarMoreFilters: Partial<FilterBarMoreFiltersProps>;
    }

    interface Components {
        CometAdminFilterBarMoreFilters?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBarMoreFilters"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarMoreFilters"];
        };
    }
}
