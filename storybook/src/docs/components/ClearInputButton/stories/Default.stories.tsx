import { ClearInputButton } from "@comet/admin";
import { Box, InputAdornment, InputBase, Typography } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Clear Input Button/Default",
};

export const Default = () => {
    return (
        <Box display="flex" alignItems="center">
            <Box marginRight={15}>
                <Typography variant="body1">Input Field with Default ClearInputButton:</Typography>
            </Box>
            <InputBase
                endAdornment={
                    <InputAdornment position="end">
                        <ClearInputButton />
                    </InputAdornment>
                }
            />
        </Box>
    );
};
