import { Home, Link as LinkIcon } from "@comet/admin-icons";
import { type SvgIconProps } from "@mui/material";
import { ReactNode } from "react";

import { type PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface PageTypeIconProps {
    page: PageTreePage;
    disabled?: boolean;
}

export function PageTypeIcon({ page, disabled }: PageTypeIconProps): JSX.Element {
    let iconColor: SvgIconProps["color"] = "primary";
    const { documentTypes } = usePageTreeContext();
    const documentType = documentTypes[page.documentType];
    let Icon: (props: SvgIconProps<"svg">) => ReactNode;

    if (page.slug === "home") {
        Icon = Home;
    } else if (page.documentType === "Link") {
        Icon = LinkIcon;
        iconColor = "inherit";
    } else {
        if (page.hideInMenu && documentType.hideInMenuIcon) {
            Icon = documentType.hideInMenuIcon;
        } else {
            Icon = documentType.menuIcon;
        }
    }

    if (page.visibility !== "Published" || disabled) {
        iconColor = "disabled";
    }

    return <Icon color={iconColor} />;
}
