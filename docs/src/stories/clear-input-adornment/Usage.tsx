import { ClearInputAdornment, FieldContainer } from "@comet/admin";
import { Cut } from "@comet/admin-icons";
import { Grid, InputBase } from "@mui/material";
import * as React from "react";

function Story() {
    const [inputText, setInputText] = React.useState<string>("Lorem ipsum");

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <FieldContainer label="Using ClearInputAdornment in an input" fullWidth>
                    <InputBase
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        endAdornment={
                            <ClearInputAdornment position="end" hasClearableContent={Boolean(inputText)} onClick={() => setInputText("")} />
                        }
                    />
                </FieldContainer>
            </Grid>
            <Grid item xs={12} md={6}>
                <FieldContainer label="Custom icon" fullWidth>
                    <InputBase
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        endAdornment={
                            <ClearInputAdornment
                                position="end"
                                hasClearableContent={Boolean(inputText)}
                                onClick={() => setInputText("")}
                                icon={<Cut />}
                            />
                        }
                    />
                </FieldContainer>
            </Grid>
        </Grid>
    );
}

export default Story;
