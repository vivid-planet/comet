import { Error } from "@comet/admin-icons";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/Icons/Render Icon in Text", module).add("Render Icon in Text", () => {
    return (
        <Typography>
            This is and Error <Error /> icon.
        </Typography>
    );
});
