import { ClearInputButton } from "@comet/admin";
import { Box, InputAdornment, InputBase, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Cut } from "../../../../../../admin-icons/lib";

storiesOf("stories/components/Clear Input Button/Custom Clear Icon", module).add("Custom Clear Icon", () => {
    return (
        <Box display={"flex"} alignItems={"center"}>
            <Box marginRight={15}>
                <Typography variant={"body1"}>Input Field with Custom ClearInputButton Icon:</Typography>
            </Box>
            <InputBase
                endAdornment={
                    <InputAdornment position="end">
                        <ClearInputButton icon={() => <Cut />} />
                    </InputAdornment>
                }
            />
        </Box>
    );
});
