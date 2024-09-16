import { Archive, Offline, Online } from "@comet/admin-icons";
import React from "react";

import { GQLPageTreeNodeVisibility } from "../../graphql.generated";

interface PageVisibilityIconProps {
    visibility: GQLPageTreeNodeVisibility;
    disabled?: boolean;
}

export function PageVisibilityIcon({ visibility, disabled }: PageVisibilityIconProps): JSX.Element {
    const color = disabled ? "disabled" : undefined;

    switch (visibility) {
        case "Published":
            return <Online color={color} />;
        case "Unpublished":
            return <Offline color={color} />;
        case "Archived":
            return <Archive color={color} />;
    }
}
