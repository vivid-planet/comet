import { IStackSwitchApi, MainContent, Stack, StackPage, StackSwitch, Toolbar, ToolbarBackButton, ToolbarItem, ToolbarTitleItem } from "@comet/admin";
import { Box, Button, Container, TextField, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

const options = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
    { title: "The Lord of the Rings: The Return of the King", year: 2003 },
    { title: "The Good, the Bad and the Ugly", year: 1966 },
    { title: "Fight Club", year: 1999 },
    { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
    { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
    { title: "Forrest Gump", year: 1994 },
    { title: "Inception", year: 2010 },
    { title: "The Lord of the Rings: The Two Towers", year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: "Goodfellas", year: 1990 },
    { title: "The Matrix", year: 1999 },
    { title: "Seven Samurai", year: 1954 },
    { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
    { title: "City of God", year: 2002 },
    { title: "Se7en", year: 1995 },
    { title: "The Silence of the Lambs", year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: "Life Is Beautiful", year: 1997 },
    { title: "The Usual Suspects", year: 1995 },
    { title: "Léon: The Professional", year: 1994 },
    { title: "Spirited Away", year: 2001 },
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
    const [searchValue, setSearchValue] = React.useState<{ title: string; year: number } | null>(null);
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
                                <Autocomplete<{ title: string; year: number }>
                                    popupIcon={null}
                                    value={searchValue}
                                    onChange={(event, newValue) => {
                                        setSearchValue(newValue);
                                    }}
                                    options={options}
                                    getOptionLabel={(option) => option.title}
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
                                <Autocomplete<{ title: string; year: number }>
                                    popupIcon={null}
                                    value={searchValue}
                                    onChange={(event, newValue) => {
                                        setSearchValue(newValue);
                                    }}
                                    options={options}
                                    getOptionLabel={(option) => option.title}
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
