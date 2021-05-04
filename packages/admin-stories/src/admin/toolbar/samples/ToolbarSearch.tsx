import { IStackSwitchApi, MainContent, Stack, StackPage, StackSwitch, Toolbar, ToolbarBackButton, ToolbarItem, ToolbarTitleItem } from "@comet/admin";
import { Box, Button, Container, TextField, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

const options = [
    { name: "Jesse Schmuck" },
    { name: "Karie Berkman" },
    { name: "Nena Holliman" },
    { name: "Gustavo Snay" },
    { name: "Jaime Santerre" },
    { name: "Eilene Villanuev" },
    { name: "Bernetta Kam" },
    { name: "Amiee Galley" },
    { name: "Sergio Dement" },
    { name: "Lily Bellini" },
    { name: "Isidra Wolff" },
    { name: "Rex Mikell" },
    { name: "Stacey Minard" },
    { name: "Nikia Julien" },
    { name: "Delbert Worman" },
    { name: "Essie Delsignor" },
    { name: "Page Vieira" },
    { name: "Tamiko Livers" },
    { name: "Tianna Sheeler" },
];

export const useStyles = makeStyles<Theme, {}, "textField">(
    () => ({
        textField: {
            backgroundColor: "red",
            textIndent: 40,
            "& div": {
                textIndent: 40,
            },
        },
    }),
    { name: "CometAdminToolbar" },
);

export const ToolbarSearch = () => {
    const [searchValue, setSearchValue] = React.useState<{ name: string } | null>(null);
    return (
        <Stack topLevelTitle={"Search"} showBreadcrumbs={false} showBackButton={false}>
            <StackSwitch initialPage="root">
                <StackPage name={"root"}>
                    <>
                        <Toolbar
                            actionItems={(stackSwitchApi: IStackSwitchApi | undefined) => {
                                return (
                                    <>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("details", "foo");
                                            }}
                                        >
                                            <Typography>Details</Typography>
                                        </Button>
                                    </>
                                );
                            }}
                        >
                            <ToolbarBackButton />
                            <ToolbarTitleItem />
                            <ToolbarItem>
                                <Autocomplete<{ name: string }>
                                    popupIcon={null}
                                    value={searchValue}
                                    onChange={(event, newValue) => {
                                        setSearchValue(newValue);
                                    }}
                                    options={options}
                                    getOptionLabel={(option) => option.name}
                                    style={{ width: 350 }}
                                    renderInput={(params) => <TextField {...params} label="Search" variant="outlined" placeholder={"Search"} />}
                                />
                            </ToolbarItem>
                        </Toolbar>

                        <MainContent>
                            <Container>
                                <Box>Content</Box>
                                <Box>{JSON.stringify(searchValue)}</Box>
                            </Container>
                        </MainContent>
                    </>
                </StackPage>
                <StackPage name={"details"} title={"Details"}>
                    <>
                        <Toolbar>
                            <ToolbarBackButton />
                            <ToolbarItem>
                                <Autocomplete<{ name: string }>
                                    popupIcon={null}
                                    value={searchValue}
                                    onChange={(event, newValue) => {
                                        setSearchValue(newValue);
                                    }}
                                    options={options}
                                    getOptionLabel={(option) => option.name}
                                    style={{ width: 350 }}
                                    renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
                                />
                            </ToolbarItem>
                            <ToolbarTitleItem />
                        </Toolbar>
                        <MainContent>
                            <Container>
                                <Box>Content</Box>
                                <Box>{JSON.stringify(searchValue)}</Box>
                            </Container>
                        </MainContent>
                    </>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};
