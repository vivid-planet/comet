import { ClearInputButton } from "@comet/admin";
import { Box, Input, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Clear Input Button/Disabled", module).add("Disabled", () => {
    return (
        <Box display={"flex"} alignItems={"center"}>
            <Box marginRight={15}>
                <Typography variant={"body1"}>Input Field with disabled ClearInputButton:</Typography>
            </Box>
            <Input endAdornment={<ClearInputButton disabled={true} />} />
        </Box>
    );
});
