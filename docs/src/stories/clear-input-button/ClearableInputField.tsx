import { ClearInputButton } from "@comet/admin";
import { Box, InputAdornment, InputBase, Typography } from "@mui/material";
import * as React from "react";

function Story() {
    const [inputText, setInputText] = React.useState<string>("");

    return (
        <Box display="flex" alignItems="center">
            <Box marginRight={15}>
                <Typography variant="body1">Input Field with clearable onClick Button Functionality:</Typography>
            </Box>
            <InputBase
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <ClearInputButton onClick={() => setInputText("")} />
                    </InputAdornment>
                }
            />
        </Box>
    );
}
export default Story;
