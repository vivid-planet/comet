import { Archive, Disabled, Online } from "@comet/admin-icons";
import React from "react";
import { useTheme } from "styled-components";

import { GQLPageTreeNodeVisibility } from "../../graphql.generated";

interface PageVisibilityIconProps {
    visibility: GQLPageTreeNodeVisibility;
    disabled?: boolean;
}

export function PageVisibilityIcon({ visibility, disabled }: PageVisibilityIconProps): JSX.Element {
    const color = disabled ? "disabled" : undefined;
    const theme = useTheme();

    if (visibility === "Published") {
        return <Online htmlColor={theme.palette.success.main} />;
    }
    if (visibility === "Unpublished") {
        return <Disabled color={color} />;
    }

    if (visibility === "Archived") {
        return <Archive color={color} />;
    }

    throw new Error("Unreachable Code");
}
