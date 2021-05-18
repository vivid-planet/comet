import {
    MainContent,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarItem,
} from "@comet/admin";
import { Search } from "@comet/admin-icons";
import { Box, Button, Container, InputAdornment, TextField, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
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

export const ToolbarSearch = () => {
    const [searchValue, setSearchValue] = React.useState<{ name: string } | null>(null);
    return (
        <Stack topLevelTitle={"Search"} showBreadcrumbs={false} showBackButton={false}>
            <StackSwitch initialPage="root">
                <StackPage name={"root"}>
                    <>
                        <Toolbar>
                            <ToolbarBackButton />
                            <ToolbarAutomaticTitleItem />
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
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder={"Search"}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </ToolbarItem>
                            <ToolbarFillSpace />
                            <ToolbarActions>
                                <StackSwitchApiContext.Consumer>
                                    {(stackSwitchApi) => (
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("details", "foo");
                                            }}
                                        >
                                            <Typography>Details</Typography>
                                        </Button>
                                    )}
                                </StackSwitchApiContext.Consumer>
                            </ToolbarActions>
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
                            <ToolbarAutomaticTitleItem />
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
