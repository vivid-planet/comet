import { File, FileNotMenu, Home, Link as LinkIcon } from "@comet/admin-icons";
import { SvgIconProps } from "@mui/material";
import React from "react";

import { PageTreePage } from "./usePageTree";

interface PageTypeIconProps {
    page: PageTreePage;
    disabled?: boolean;
}

export function PageTypeIcon({ page, disabled }: PageTypeIconProps): JSX.Element {
    let Icon = File;
    let iconColor: SvgIconProps["color"] = "primary";

    if (page.slug === "home") {
        Icon = Home;
    } else if (page.documentType === "Link") {
        Icon = LinkIcon;
        iconColor = "inherit";
    } else if (page.hideInMenu) {
        Icon = FileNotMenu;
    }

    if (page.visibility !== "Published" || disabled) {
        iconColor = "disabled";
    }

    return <Icon color={iconColor} />;
}
