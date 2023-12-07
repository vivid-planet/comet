import { BlockCategory, blockCategoryLabels } from "@comet/blocks-admin";
import React from "react";
import { FormattedMessage } from "react-intl";

declare module "@comet/blocks-admin" {
    interface AllBlockCategories {
        Custom: "Custom";
    }
}

BlockCategory["Custom"] = "Custom";

blockCategoryLabels.Custom = <FormattedMessage id="blocks.category.custom" defaultMessage="Custom category" />;
