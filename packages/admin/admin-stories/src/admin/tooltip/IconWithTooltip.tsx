import { Tooltip } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("@comet/admin", module).add("Icon with Tooltip", () => {
    return (
        <>
            <Tooltip title="Add something">
                <Add />
            </Tooltip>
        </>
    );
});
