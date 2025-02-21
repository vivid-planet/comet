import { type ReactNode } from "react";

import * as sc from "./InsertInBetweenAction.sc";

interface Props {
    top?: ReactNode;
    bottom?: ReactNode;
}

// Layout component, a button can be on top, on bottom or on both of the tree-row
export default function InsertInBetweenAction({ top, bottom }: Props) {
    return (
        <sc.Root>
            <sc.TopSpot>{top}</sc.TopSpot>
            <sc.BottomSpot>{bottom}</sc.BottomSpot>
        </sc.Root>
    );
}
