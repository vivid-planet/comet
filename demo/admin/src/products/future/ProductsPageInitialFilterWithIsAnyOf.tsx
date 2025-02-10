import { StackMainContent } from "@comet/admin";

import { ProductsGrid } from "./generated/ProductsGridInitialFitlerWithIsAnyOf";

export function ProductsPageInitialFilterWithIsAnyOf() {
    return (
        <StackMainContent fullHeight>
            <ProductsGrid />
        </StackMainContent>
    );
}
