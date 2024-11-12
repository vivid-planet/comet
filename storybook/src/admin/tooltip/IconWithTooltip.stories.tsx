import { Tooltip } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import * as React from "react";

export default {
    title: "@comet/admin",
};

export const IconWithTooltip = {
    render: () => {
        return (
            <Tooltip title="Add something">
                <Add />
            </Tooltip>
        );
    },

    name: "Icon with Tooltip",
};
