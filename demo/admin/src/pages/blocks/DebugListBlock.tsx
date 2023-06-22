import { createListBlock } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DebugBlock } from "./DebugBlock";

export const DebugListBlock = createListBlock({
    name: "DebugList",
    block: DebugBlock,
    displayName: <FormattedMessage id="blocks.debugList.displayName" defaultMessage="Debug list" />,
    itemName: <FormattedMessage id="blocks.debugList.itemName" defaultMessage="debug" />,
    itemsName: <FormattedMessage id="blocks.debugList.itemsName" defaultMessage="debugs" />,
});
