import { EllipsisTooltip } from "@comet/admin";
import { Paper, Stack, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/EllipsisTooltip", module).add("Simple", () => {
    return (
        <Stack direction="row" justifyContent="center" spacing={4}>
            <Paper elevation={1} sx={{ width: 200, p: 2 }}>
                <Typography textAlign="center">
                    <EllipsisTooltip>Short Text</EllipsisTooltip>
                </Typography>
            </Paper>
            <Paper elevation={1} sx={{ width: 200, p: 2 }}>
                <Typography textAlign="center">
                    <EllipsisTooltip>
                        Really long text that requires the tooltip to show the entire text that should be shown in this element.
                    </EllipsisTooltip>
                </Typography>
            </Paper>
        </Stack>
    );
});
