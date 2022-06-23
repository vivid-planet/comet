import { File, FileNotMenu, Home, Link as LinkIcon } from "@comet/admin-icons";
import React from "react";

import { PageTreePage } from "./usePageTree";

interface PageTypeIconProps {
    page: PageTreePage;
}

export function PageTypeIcon({ page }: PageTypeIconProps): JSX.Element {
    let Icon = File;

    if (page.slug === "home") {
        Icon = Home;
    } else if (page.documentType === "Link") {
        Icon = LinkIcon;
    } else if (page.hideInMenu) {
        Icon = FileNotMenu;
    }

    return <Icon color={page.visibility === "Published" ? "primary" : "disabled"} />;
}
