import { ContentOverflow } from "@comet/admin";
import { Typography } from "@mui/material";
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import * as React from "react";

function Story() {
    return (
        <ContentOverflow
            slotProps={{
                clickableContent: {
                    disabled: true,
                },
            }}
        >
            <Typography variant="h2">Title</Typography>
            <Typography>
                Lorem ipsum etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis
                risus eget urna mollis ornare vel eu leo.
            </Typography>
        </ContentOverflow>
    );
}

export default Story;
