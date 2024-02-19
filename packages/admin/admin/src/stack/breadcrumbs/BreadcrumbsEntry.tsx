import { LevelUp } from "@comet/admin-icons";
import { IconButton as MuiIconButton, Link as MuiLink, Typography } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import * as React from "react";

import { BreadcrumbItem } from "../Stack";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { BackButtonSeparator, StackBreadcrumbsProps } from "./StackBreadcrumbs";

const Link = styled(MuiLink, {
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
) as typeof MuiLink;

const DisabledLink = styled(Typography, {
    name: "CometAdminStackBreadcrumbs",
    slot: "disabledLink",
    overridesResolver(_, styles) {
        return [styles.link, styles.disabledLink];
    },
})(
    ({ theme }) => css`
        font-size: 13px;
        line-height: 14px;
        font-weight: ${theme.typography.fontWeightMedium};
        text-decoration-color: currentColor;
        color: ${theme.palette.text.disabled};
    `,
);

const IconButton = styled(MuiIconButton, {
    name: "CometAdminStackBreadcrumbs",
    slot: "backButton",
    overridesResolver(_, styles) {
        return [styles.backButton];
    },
})() as typeof MuiIconButton;

interface BreadcrumbsEntryProps {
    item: BreadcrumbItem;
    isLastItem?: boolean;
    backButtonUrl?: string;
    slotProps: StackBreadcrumbsProps["slotProps"];
}

export const BreadcrumbsEntry = ({ item, isLastItem, backButtonUrl, slotProps }: BreadcrumbsEntryProps) => {
    return (
        <>
            {backButtonUrl && (
                <>
                    {/* @ts-expect-error: TODO: Fix type */}
                    <IconButton component={BreadcrumbLink} to={backButtonUrl} {...slotProps?.backButton}>
                        <LevelUp />
                    </IconButton>
                    <BackButtonSeparator {...slotProps?.backButtonSeparator} />
                </>
            )}
            {isLastItem ? (
                <DisabledLink {...slotProps?.disabledLink} variant="body2">
                    {item.title}
                </DisabledLink>
            ) : (
                <Link to={item.url} component={BreadcrumbLink} variant="body2" {...slotProps?.link}>
                    {item.title}
                </Link>
            )}
        </>
    );
};
