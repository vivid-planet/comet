import { LevelUp } from "@comet/admin-icons";
import { IconButton, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import { css, styled, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";

import { BreadcrumbItem } from "../Stack";
import { BreadcrumbLink } from "./BreadcrumbLink";

const StyledLink: typeof Link = styled(Link, {
    name: "CometAdminStackBreadcrumbs",
    slot: "link",
    overridesResolver(_, styles) {
        return [styles.link];
    },
})(
    ({ theme }) => css`
        font-size: 13px;
        line-height: 14px;
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.palette.grey[600]};
        text-decoration-color: currentColor;
    `,
);

const StyledDisabledLink = styled(Typography, {
    name: "CometAdminStackBreadcrumbs",
    slot: "disabledLink",
    overridesResolver(_, styles) {
        return [styles.disabledLink];
    },
})(
    ({ theme }) => css`
        font-size: 13px;
        line-height: 14px;
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.palette.grey[600]};
        text-decoration-color: currentColor;
        color: ${theme.palette.text.disabled};
    `,
);

const BackButtonSeparator = styled("div", {
    name: "CometAdminStackBreadcrumbs",
    slot: "backButtonSeparator",
    overridesResolver(_, styles) {
        return [styles.backButtonSeparator];
    },
})(
    ({ theme }) => css`
        height: 30px;
        width: 1px;
        background-color: ${theme.palette.divider};
        margin-right: 12px;
    `,
);

export interface BreadcrumbsEntryProps
    extends ThemedComponentBaseProps<{ link: typeof Link; backButtonSeparator: "div"; disabledLink: typeof Typography }> {
    item: BreadcrumbItem;
    isLastItem?: boolean;
    backButtonUrl?: string;
}

export function BreadcrumbsEntry(inProps: BreadcrumbsEntryProps) {
    const { item, isLastItem, backButtonUrl, slotProps } = useThemeProps({ props: inProps, name: "CometAdminBreadcrumbsEntry" });
    return (
        <>
            {backButtonUrl && (
                <>
                    <IconButton component={BreadcrumbLink} to={backButtonUrl}>
                        <LevelUp />
                    </IconButton>
                    <BackButtonSeparator {...slotProps?.backButtonSeparator} />
                </>
            )}
            {isLastItem ? (
                <StyledDisabledLink {...slotProps?.disabledLink} variant="body2">
                    {item.title}
                </StyledDisabledLink>
            ) : (
                <StyledLink to={item.url} component={BreadcrumbLink} variant="body2" {...slotProps?.link}>
                    {item.title}
                </StyledLink>
            )}
        </>
    );
}
