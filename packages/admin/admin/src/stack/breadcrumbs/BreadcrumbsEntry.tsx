import { LevelUp } from "@comet/admin-icons";
import { IconButton as MuiIconButton, Link as MuiLink, Typography } from "@mui/material";
import { css } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { BreadcrumbItem } from "../Stack";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { BackButtonSeparator, StackBreadcrumbsClassKey, StackBreadcrumbsProps } from "./StackBreadcrumbs";

const Link = createComponentSlot(MuiLink)<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "link",
})(
    ({ theme }) => css`
        font-size: 13px;
        line-height: 14px;
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.palette.grey[600]};
        text-decoration-color: currentColor;
    `,
) as typeof MuiLink;

const DisabledLink = createComponentSlot(Typography)<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "disabledLink",
    classesResolver() {
        return ["link"];
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

const IconButton = createComponentSlot(MuiIconButton)<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "backButton",
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
