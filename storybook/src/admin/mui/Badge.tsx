import { Badge } from "@comet/admin";
import { Box, Card, CardContent, Link, Stack, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    return (
        <Stack spacing={4}>
            <Card>
                <CardContent>
                    <Typography variant="h3" gutterBottom>
                        Standalone Badge
                    </Typography>
                    <Typography variant="body2">
                        If no children are passed, the badge will be a standalone component placed as is. For further docs about props and usage of
                        the Badge component refer to the{" "}
                        <Link href="https://mui.com/material-ui/react-badge/" target="_blank">
                            MUI docs
                        </Link>
                        .
                    </Typography>
                    <br />

                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" mr={2}>
                            Some Text
                        </Typography>
                        <Badge color="primary" badgeContent={2} />
                    </Box>
                </CardContent>
            </Card>
        </Stack>
    );
}

storiesOf("@comet/admin/mui", module).add("Badge", () => <Story />);
