import { EllipsisTooltip } from "@comet/admin";
import { CheckmarkCircle, CrossCircle } from "@comet/admin-icons";
import { Paper, Stack, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/EllipsisTooltip", module).add("TextStyling", () => {
    return (
        <Stack direction="row" justifyContent="center" spacing={4}>
            <Stack spacing={2} width={300}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckmarkCircle color="success" />
                    <Typography variant="h5">Correct usage</Typography>
                </Stack>
                <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography sx={{ fontSize: 18, lineHeight: 1.4, fontWeigh: 300, color: "#333" }}>
                        <EllipsisTooltip>Lorem ipsum integer posuere erat a ante venenatis dapibus posuere velit aliquet.</EllipsisTooltip>
                    </Typography>
                </Paper>
            </Stack>
            <Stack spacing={2} width={300}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CrossCircle color="error" />
                    <Typography variant="h5">Breaks tooltip styling</Typography>
                </Stack>
                <Paper elevation={1} sx={{ p: 2 }}>
                    <EllipsisTooltip>
                        <Typography sx={{ display: "inline", fontSize: 18, lineHeight: 1.4, fontWeigh: 300, color: "#333" }}>
                            Lorem ipsum integer posuere erat a ante venenatis dapibus posuere velit aliquet.
                        </Typography>
                    </EllipsisTooltip>
                </Paper>
            </Stack>
            <Stack spacing={2} width={300}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CrossCircle color="error" />
                    <Typography variant="h5">Prevents tooltip from rendering</Typography>
                </Stack>
                <Paper elevation={1} sx={{ p: 2 }}>
                    <EllipsisTooltip>
                        <Typography sx={{ fontSize: 18, lineHeight: 1.4, fontWeigh: 300, color: "#333" }}>
                            Lorem ipsum integer posuere erat a ante venenatis dapibus posuere velit aliquet.
                        </Typography>
                    </EllipsisTooltip>
                </Paper>
            </Stack>
        </Stack>
    );
});
