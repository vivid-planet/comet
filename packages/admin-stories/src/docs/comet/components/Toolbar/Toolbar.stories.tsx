import {
    Field,
    FinalFormInput,
    FinalFormSearchTextField,
    SaveButton,
    SplitButton,
    StackApiContext,
    StackSwitchApiContext,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarBreadcrumbs,
    ToolbarFillSpace,
    ToolbarItem,
    ToolbarTitleItem,
} from "@comet/admin";
import { ChevronLeft, CometColor, Search } from "@comet/admin-icons";
import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";
import { FormattedMessage } from "react-intl";
import StoryRouter from "storybook-react-router";

import { toolbarDecorator } from "../../components/Toolbar/toolbar.decorator";

storiesOf("stories/components/toolbar", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(StoryRouter())
    .add("Empty", () => {
        return <Toolbar />;
    })
    .add("Automatic Title Item", () => {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
            </Toolbar>
        );
    })
    .add("Title Item", () => {
        return (
            <Toolbar>
                <ToolbarTitleItem>Toolbar Title Item</ToolbarTitleItem>
            </Toolbar>
        );
    })
    .add("Localized Title Item", () => {
        return (
            <Toolbar>
                <ToolbarTitleItem>
                    <FormattedMessage id={"storybook.toolbartitleitem.title"} defaultMessage={"Localized Title"} />
                </ToolbarTitleItem>
            </Toolbar>
        );
    })
    .add("Breadcrumbs", () => {
        return (
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarBreadcrumbs />
                <ToolbarFillSpace />
                <ToolbarActions>
                    <StackSwitchApiContext.Consumer>
                        {(stackSwitchApi) => (
                            <Grid container spacing={4}>
                                <Grid item>
                                    <Button
                                        color={"primary"}
                                        variant={"contained"}
                                        onClick={() => {
                                            stackSwitchApi.activatePage("page-1", "details");
                                        }}
                                    >
                                        1
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color={"primary"}
                                        variant={"contained"}
                                        onClick={() => {
                                            stackSwitchApi.activatePage("page-2", "details");
                                        }}
                                    >
                                        2
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                    </StackSwitchApiContext.Consumer>
                </ToolbarActions>
            </Toolbar>
        );
    })
    .add("Back Button", () => {
        return (
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarAutomaticTitleItem />
                <ToolbarFillSpace />
                <ToolbarActions>
                    <StackSwitchApiContext.Consumer>
                        {(stackSwitchApi) => (
                            <>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={() => {
                                        stackSwitchApi?.activatePage("automaticTitleDetail", "details");
                                    }}
                                >
                                    <Typography>Go To Details</Typography>
                                </Button>
                            </>
                        )}
                    </StackSwitchApiContext.Consumer>
                </ToolbarActions>
            </Toolbar>
        );
    })
    .add("Fill Space left", () => {
        return (
            <Toolbar>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("Fill Space right", () => {
        return (
            <Toolbar>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
                <ToolbarFillSpace />
            </Toolbar>
        );
    })
    .add("Fill Space middle", () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("Fill Space middle 2", () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Button
                                color={"primary"}
                                variant={"contained"}
                                onClick={() => {
                                    alert("clicked Action 1");
                                }}
                            >
                                Action 1
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                color={"secondary"}
                                variant={"contained"}
                                onClick={() => {
                                    alert("clicked Action 2");
                                }}
                            >
                                Action 2
                            </Button>
                        </Grid>
                    </Grid>
                </ToolbarActions>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("ToolbarItem", () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <Typography>Item 1</Typography>
                </ToolbarItem>
                <ToolbarItem>
                    <Typography>Item 2</Typography>
                </ToolbarItem>
                <ToolbarItem>
                    <Typography>Item 3</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("toolbaritem mixing with other components", () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <Typography>Item 1</Typography>
                </ToolbarItem>
                <ToolbarAutomaticTitleItem />
                <ToolbarItem>
                    <Typography>Item 2</Typography>
                </ToolbarItem>
                <ToolbarItem>
                    <Typography>Item 3</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("ToolbarActions one action", () => {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => {
                            alert("clicked Action");
                        }}
                    >
                        Action
                    </Button>
                </ToolbarActions>
            </Toolbar>
        );
    })
    .add("ToolbarActions two actions", () => {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Button
                                color={"primary"}
                                variant={"contained"}
                                onClick={() => {
                                    alert("clicked Action 1");
                                }}
                            >
                                Action 1
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                color={"secondary"}
                                variant={"contained"}
                                onClick={() => {
                                    alert("clicked Action 2");
                                }}
                            >
                                Action 2
                            </Button>
                        </Grid>
                    </Grid>
                </ToolbarActions>
            </Toolbar>
        );
    })
    .add("Custom Title H1", () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <Typography variant={"h1"}>Custom Title H1</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("Custom Title H2", () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <>
                        <CometColor fontSize={"large"} />
                        <Typography variant={"h2"}>Custom Title H2</Typography>
                    </>
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("Custom Title H3", () => {
        return (
            <Toolbar>
                <div style={{ display: "flex", backgroundColor: "black", alignItems: "center", paddingLeft: 20, paddingRight: 20 }}>
                    <Typography variant={"h3"} color={"primary"}>
                        Custom Title H3
                    </Typography>
                </div>
            </Toolbar>
        );
    })
    .add("Custom Title H4", () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant={"h4"}>Multi Line - Custom Title H4</Typography>
                        <Typography variant={"h4"}>Multi Line - Custom Title H4</Typography>
                        <Typography variant={"h4"}>Multi Line - Custom Title H4</Typography>
                    </div>
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("Custom Back Button", () => {
        return (
            <StackApiContext.Consumer>
                {(stackApi) => (
                    <Toolbar>
                        {stackApi && stackApi.breadCrumbs.length > 1 && (
                            <ToolbarItem>
                                <IconButton
                                    color={"primary"}
                                    onClick={() => {
                                        stackApi.goBack?.();
                                    }}
                                >
                                    <ChevronLeft fontSize={"large"} />
                                    <Typography>Back</Typography>
                                </IconButton>
                            </ToolbarItem>
                        )}
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <StackSwitchApiContext.Consumer>
                                {(stackSwitchApi) => (
                                    <>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("automaticTitleDetail", "details");
                                            }}
                                        >
                                            <Typography>Go To Details</Typography>
                                        </Button>
                                    </>
                                )}
                            </StackSwitchApiContext.Consumer>
                        </ToolbarActions>
                    </Toolbar>
                )}
            </StackApiContext.Consumer>
        );
    })
    .add("Search Final Form", () => {
        return (
            <Form
                onSubmit={() => {
                    alert("on submit");
                }}
                render={({ values }) => {
                    return (
                        <form>
                            <Toolbar>
                                <ToolbarItem>
                                    <Field name="query" component={FinalFormSearchTextField} />
                                </ToolbarItem>
                                <ToolbarItem>Debug Final Form Values: {JSON.stringify(values)}</ToolbarItem>
                            </Toolbar>
                        </form>
                    );
                }}
            />
        );
    })
    .add("Search Final Form custom icon", () => {
        return (
            <Form
                onSubmit={() => {
                    alert("on submit");
                }}
                render={({ values }) => {
                    return (
                        <form>
                            <Toolbar>
                                <ToolbarItem>
                                    <Field
                                        name="query"
                                        type="text"
                                        component={FinalFormSearchTextField}
                                        icon={<CometColor />}
                                        placeholder={"Comet Search"}
                                    />
                                </ToolbarItem>
                                <ToolbarItem>Debug Final Form Values: {JSON.stringify(values)}</ToolbarItem>
                            </Toolbar>
                        </form>
                    );
                }}
            />
        );
    })
    .add("Search Final Form Input", () => {
        return (
            <Form
                onSubmit={() => {
                    alert("on submit");
                }}
                render={({ values }) => {
                    return (
                        <form>
                            <Toolbar>
                                <ToolbarItem>
                                    <Field name="query" type="text" component={FinalFormInput} />
                                </ToolbarItem>
                                <ToolbarItem>Debug Final Form Values: {JSON.stringify(values)}</ToolbarItem>
                            </Toolbar>
                        </form>
                    );
                }}
            />
        );
    })
    .add("Search Autocomplete", () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <Autocomplete
                        popupIcon={null}
                        options={[
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
                        ]}
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
                                            <div style={{ padding: 5 }}>
                                                <Search />
                                            </div>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("SplitButton Save", () => {
        const [saving, setSaving] = React.useState(false);
        return (
            <Toolbar>
                <ToolbarTitleItem>Save Split Button</ToolbarTitleItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <SplitButton localStorageKey={"Page5.SaveSplitButton"} color={"primary"} variant={"contained"}>
                        <SaveButton
                            saving={saving}
                            onClick={() => {
                                setSaving(true);
                                setTimeout(() => {
                                    setSaving(false);
                                }, 1000);
                            }}
                        >
                            <FormattedMessage id={"comet.save"} defaultMessage={"Save"} />
                        </SaveButton>
                        <SaveButton
                            saving={saving}
                            onClick={() => {
                                setSaving(true);
                                setTimeout(() => {
                                    setSaving(false);
                                }, 1000);
                            }}
                        >
                            <FormattedMessage id={"comet.saveAndGoBack"} defaultMessage={"Save and Go Back"} />
                        </SaveButton>
                    </SplitButton>
                </ToolbarActions>
            </Toolbar>
        );
    })
    .add("Save", () => {
        const [saving, setSaving] = React.useState(false);
        return (
            <Toolbar>
                <ToolbarTitleItem>Save Button</ToolbarTitleItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <SaveButton
                        color={"primary"}
                        variant={"contained"}
                        saving={saving}
                        onClick={() => {
                            setSaving(true);
                            setTimeout(() => {
                                setSaving(false);
                            }, 1000);
                        }}
                    >
                        <FormattedMessage id={"comet.save"} defaultMessage={"Save"} />
                    </SaveButton>
                </ToolbarActions>
            </Toolbar>
        );
    });
