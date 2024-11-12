import { Error } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/Icons/Render Icon in Text",
};

export const RenderIconInText = {
    render: () => {
        return (
            <Typography>
                This is an error <Error /> icon.
            </Typography>
        );
    },

    name: "Render Icon in Text",
};
