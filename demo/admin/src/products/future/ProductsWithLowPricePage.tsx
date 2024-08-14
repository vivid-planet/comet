import { MainContent } from "@comet/admin";
import * as React from "react";

import { ProductsGrid } from "./generated/ProductsGrid";

export function ProductsWithLowPricePage(): React.ReactElement {
    // This grid needs no add or edit-button
    return (
        <MainContent fullHeight>
            <ProductsGrid filter={{ price: { lowerThan: 10 } }} />
        </MainContent>
    );
}
