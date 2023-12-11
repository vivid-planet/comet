import React from "react";

import * as sc from "./InsertInBetweenAction.sc";

interface Props {
    top?: React.ReactNode;
    bottom?: React.ReactNode;
}

// Layout component, a button can be on top, on bottom or on both of the tree-row
export default function InsertInBetweenAction({ top, bottom }: Props): React.ReactElement {
    return (
        <sc.Root>
            <sc.TopSpot>{top}</sc.TopSpot>
            <sc.BottomSpot>{bottom}</sc.BottomSpot>
        </sc.Root>
    );
}
