import { FieldContainer, FormPaper } from "@comet/admin";
import { Search } from "@comet/admin-icons";
import { Checkbox, FormControlLabel, Grid, InputAdornment, InputBase, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    const [searchString1, setSearchString1] = React.useState<string>("");
    const [searchString2, setSearchString2] = React.useState<string>("");
    const [checkboxValue, setCheckboxValue] = React.useState<boolean>(false);

    return (
        <div style={{ width: 400 }}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <FormPaper variant="outlined">
                        <Typography variant={"h4"} gutterBottom>
                            Single TextField outside of form
                        </Typography>
                        <FieldContainer fullWidth>
                            <InputBase
                                autoFocus
                                placeholder={"Search..."}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                }
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchString1(e.target.value)}
                                value={searchString1}
                            />
                        </FieldContainer>
                    </FormPaper>
                </Grid>
                <Grid item xs={12}>
                    <FormPaper variant="outlined">
                        <Typography variant={"h4"} gutterBottom>
                            With Checkbox
                        </Typography>
                        <FieldContainer fullWidth>
                            <InputBase
                                placeholder={"Search..."}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                }
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchString2(e.target.value)}
                                value={searchString2}
                            />
                        </FieldContainer>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkboxValue}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckboxValue(e.target.checked)}
                                />
                            }
                            label={"Additional Setting"}
                        />
                    </FormPaper>
                </Grid>
            </Grid>
            <div>
                <pre>{JSON.stringify({ searchString1, searchString2, checkboxValue }, undefined, 2)}</pre>
            </div>
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Single TextField", () => <Story />);
