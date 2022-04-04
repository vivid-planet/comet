import { ClearInputButton } from "@comet/admin";
import { Cut } from "@comet/admin-icons";
import { Box, InputAdornment, InputBase, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Clear Input Button/Custom Clear Icon", module).add("Custom Clear Icon", () => {
    return (
        <Box display={"flex"} alignItems={"center"}>
            <Box marginRight={15}>
                <Typography variant={"body1"}>Input Field with Custom ClearInputButton Icon:</Typography>
            </Box>
            <InputBase
                endAdornment={
                    <InputAdornment position="end">
                        <ClearInputButton icon={<Cut />} />
                    </InputAdornment>
                }
            />
        </Box>
    );
});
