import {
    Button,
    CancelButton,
    DeleteButton,
    FeedbackButton,
    FieldSet,
    FillSpace,
    FinalForm,
    FinalFormSaveButton,
    MainContent,
    OkayButton,
    SaveBoundary,
    SaveBoundarySaveButton,
    SaveButton,
    StackMainContent,
    StackToolbar,
    TextAreaField,
    TextField,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarTitleItem,
} from "@comet/admin";
import { ArrowRight } from "@comet/admin-icons";
import { Box, Chip, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type Decorator, type Meta, type StoryObj } from "@storybook/react-webpack5";
import { useState } from "react";

import { commonComponentDocsMeta } from "./utils/commonComponentDocsMeta";

// Prevent rendering components as  `<React.ForwardRef />`
// TODO: Should we do this in the component itself? Is it needed for anything other than the story?
// TODO: We may also need this for all icons.
// @ts-expect-error TODO: Can we fix this type?
Button.displayName = "Button";
ArrowRight.displayName = "ArrowRight";
// @ts-expect-error TODO: Can we fix this type?
Box.displayName = "Box";

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
    ...commonComponentDocsMeta,
    component: Button,
    title: "Admin Components/Button",
    argTypes: {
        children: {
            control: "text",
        },
        disabled: {
            control: "boolean",
        },
        variant: {
            control: "select",
            options: [undefined, "primary", "secondary", "outlined", "destructive", "success", "textLight", "textDark"],
        },
        startIcon: {
            control: "select",
            options: [undefined, "ArrowRight"],
        },
        endIcon: {
            control: "select",
            options: [undefined, "ArrowRight"],
        },
    },
    args: {
        children: "Button",
        disabled: false,
    },
};

export default meta;

export const DefaultStory: Story = {
    render: ({ startIcon, endIcon, variant, ...props }) => {
        const buttonNode = (
            <Button
                {...props}
                variant={variant}
                startIcon={startIcon === "ArrowRight" ? <ArrowRight /> : undefined}
                endIcon={endIcon === "ArrowRight" ? <ArrowRight /> : undefined}
            />
        );

        if (variant === "textLight") {
            // TODO: Is there a way to simply set the background of the story container?
            return <Box sx={{ backgroundColor: "grey.800", padding: 4 }}>{buttonNode}</Box>;
        }

        return buttonNode;
    },
};
DefaultStory.name = "Button";

const ListOfButtons = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing(4),
    rowGap: theme.spacing(2),
    flexWrap: "wrap",
}));

const DarkListOfButtons = styled(ListOfButtons)(({ theme }) => ({
    backgroundColor: theme.palette.grey[800],
    margin: theme.spacing(-4),
    padding: theme.spacing(4),
}));

export const AdvancedExamples = {
    render: () => {
        return (
            <Stack spacing={10}>
                <ListOfButtons>
                    <Button>Button</Button>
                    <Button startIcon={<ArrowRight />}>Button</Button>
                    <Button endIcon={<ArrowRight />}>Button</Button>
                    <Button endIcon={<Chip label="5" />}>Button</Button>
                    <Button startIcon={<ArrowRight />} endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button
                        endIcon={
                            <>
                                <ArrowRight />
                                <Chip label="5" />
                            </>
                        }
                    >
                        Button
                    </Button>
                    <Button>
                        <ArrowRight />
                    </Button>
                    <Button endIcon={<ArrowRight />} disabled>
                        Button
                    </Button>
                </ListOfButtons>
                <ListOfButtons>
                    <Button variant="secondary">Button</Button>
                    <Button variant="secondary" startIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="secondary" endIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="secondary" endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button variant="secondary" startIcon={<ArrowRight />} endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button
                        variant="secondary"
                        endIcon={
                            <>
                                <ArrowRight />
                                <Chip label="5" />
                            </>
                        }
                    >
                        Button
                    </Button>
                    <Button variant="secondary">
                        <ArrowRight />
                    </Button>
                    <Button variant="secondary" endIcon={<ArrowRight />} disabled>
                        Button
                    </Button>
                </ListOfButtons>
                <ListOfButtons>
                    <Button variant="outlined">Button</Button>
                    <Button variant="outlined" startIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="outlined" endIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="outlined" endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button variant="outlined" startIcon={<ArrowRight />} endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button
                        variant="outlined"
                        endIcon={
                            <>
                                <ArrowRight />
                                <Chip label="5" />
                            </>
                        }
                    >
                        Button
                    </Button>
                    <Button variant="outlined">
                        <ArrowRight />
                    </Button>
                    <Button variant="outlined" endIcon={<ArrowRight />} disabled>
                        Button
                    </Button>
                </ListOfButtons>
                <ListOfButtons>
                    <Button variant="destructive">Button</Button>
                    <Button variant="destructive" startIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="destructive" endIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="destructive" endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button variant="destructive" startIcon={<ArrowRight />} endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button
                        variant="destructive"
                        endIcon={
                            <>
                                <ArrowRight />
                                <Chip label="5" />
                            </>
                        }
                    >
                        Button
                    </Button>
                    <Button variant="destructive">
                        <ArrowRight />
                    </Button>
                    <Button variant="destructive" endIcon={<ArrowRight />} disabled>
                        Button
                    </Button>
                </ListOfButtons>
                <ListOfButtons>
                    <Button variant="success">Button</Button>
                    <Button variant="success" startIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="success" endIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="success" endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button variant="success" startIcon={<ArrowRight />} endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button
                        variant="success"
                        endIcon={
                            <>
                                <ArrowRight />
                                <Chip label="5" />
                            </>
                        }
                    >
                        Button
                    </Button>
                    <Button variant="success">
                        <ArrowRight />
                    </Button>
                    <Button variant="success" endIcon={<ArrowRight />} disabled>
                        Button
                    </Button>
                </ListOfButtons>
                <Box>
                    <DarkListOfButtons>
                        <Button variant="textLight">Button</Button>
                        <Button variant="textLight" startIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="textLight" endIcon={<ArrowRight />}>
                            Button
                        </Button>
                        <Button variant="textLight" endIcon={<Chip label="5" />}>
                            Button
                        </Button>
                        <Button variant="textLight" startIcon={<ArrowRight />} endIcon={<Chip label="5" />}>
                            Button
                        </Button>
                        <Button
                            variant="textLight"
                            endIcon={
                                <>
                                    <ArrowRight />
                                    <Chip label="5" />
                                </>
                            }
                        >
                            Button
                        </Button>
                        <Button variant="textLight">
                            <ArrowRight />
                        </Button>
                        <Button variant="textLight" endIcon={<ArrowRight />} disabled>
                            Button
                        </Button>
                    </DarkListOfButtons>
                </Box>
                <ListOfButtons>
                    <Button variant="textDark">Button</Button>
                    <Button variant="textDark" startIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="textDark" endIcon={<ArrowRight />}>
                        Button
                    </Button>
                    <Button variant="textDark" endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button variant="textDark" startIcon={<ArrowRight />} endIcon={<Chip label="5" />}>
                        Button
                    </Button>
                    <Button
                        variant="textDark"
                        endIcon={
                            <>
                                <ArrowRight />
                                <Chip label="5" />
                            </>
                        }
                    >
                        Button
                    </Button>
                    <Button variant="textDark">
                        <ArrowRight />
                    </Button>
                    <Button variant="textDark" endIcon={<ArrowRight />} disabled>
                        Button
                    </Button>
                </ListOfButtons>
            </Stack>
        );
    },
};

export const ResponsiveExample = {
    render: () => {
        return (
            <Button startIcon={<ArrowRight />} responsive>
                Responsive Button
            </Button>
        );
    },
};

export const ResponsiveExampleInToolbar = {
    render: () => {
        return (
            <Toolbar>
                <ToolbarTitleItem>Toolbar</ToolbarTitleItem>
                <FillSpace />
                <ToolbarActions>
                    <Button startIcon={<ArrowRight />} responsive>
                        Responsive Button
                    </Button>
                </ToolbarActions>
            </Toolbar>
        );
    },
};

const moreVerticalSpaceDecorator = (): Decorator => {
    return (Story) => {
        return (
            <Box py={4}>
                <Story />
            </Box>
        );
    };
};

const spacedElementsDecorator = (): Decorator => {
    return (Story) => {
        return (
            <Stack direction="row" spacing={4}>
                <Story />
            </Stack>
        );
    };
};

const slowAsyncFunctionThatSucceeds = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 500);
    });
};

const slowAsyncFunctionThatFails = () => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(false), 500);
    });
};

export const FeedbackButtonExample = {
    decorators: [spacedElementsDecorator(), moreVerticalSpaceDecorator()],
    render: () => {
        return (
            <>
                <FeedbackButton
                    startIcon={<ArrowRight />}
                    onClick={async () => {
                        await slowAsyncFunctionThatSucceeds();
                    }}
                >
                    This will succeed
                </FeedbackButton>
                <FeedbackButton
                    startIcon={<ArrowRight />}
                    onClick={async () => {
                        await slowAsyncFunctionThatFails();
                    }}
                >
                    This will fail
                </FeedbackButton>
            </>
        );
    },
};

export const FeedbackButtonControlledState = {
    decorators: [spacedElementsDecorator(), moreVerticalSpaceDecorator()],

    render: () => {
        const [firstButtonLoading, setFirstButtonLoading] = useState(false);
        const [firstButtonHasErrors, setFirstButtonHasErrors] = useState(false);

        const [secondButtonLoading, setSecondButtonLoading] = useState(false);
        const [secondButtonHasErrors, setSecondButtonHasErrors] = useState(false);

        return (
            <>
                <FeedbackButton
                    startIcon={<ArrowRight />}
                    loading={firstButtonLoading}
                    hasErrors={firstButtonHasErrors}
                    onClick={() => {
                        setFirstButtonLoading(true);

                        setTimeout(() => {
                            setFirstButtonLoading(false);
                            setFirstButtonHasErrors(false);
                        }, 500);
                    }}
                >
                    This will succeed
                </FeedbackButton>
                <FeedbackButton
                    startIcon={<ArrowRight />}
                    loading={secondButtonLoading}
                    hasErrors={secondButtonHasErrors}
                    onClick={() => {
                        setSecondButtonLoading(true);

                        setTimeout(() => {
                            setSecondButtonLoading(false);
                            setSecondButtonHasErrors(true);
                        }, 500);
                    }}
                >
                    This will fail
                </FeedbackButton>
            </>
        );
    },
};

export const SaveButtonExample = {
    render: () => {
        // TODO: Add proper example when https://github.com/vivid-planet/comet/pull/3589 is merged
        return <SaveButton />;
    },
};

export const FinalFormSaveButtonExample = {
    render: () => {
        return (
            <FinalForm
                mode="edit"
                onSubmit={async () => {
                    // Submit data
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    alert("Form data submitted");
                }}
            >
                <Toolbar>
                    <ToolbarAutomaticTitleItem />
                    <FillSpace />
                    <ToolbarActions>
                        <FinalFormSaveButton />
                    </ToolbarActions>
                </Toolbar>
                <MainContent>
                    <FieldSet>
                        <TextField label="Title" placeholder="Title" name="title" fullWidth variant="horizontal" />
                        <TextAreaField name="description" placeholder="Description" label="Description" fullWidth variant="horizontal" />
                    </FieldSet>
                </MainContent>
            </FinalForm>
        );
    },
};

export const SaveBoundarySaveButtonExample = {
    render: () => {
        return (
            <SaveBoundary>
                <StackToolbar>
                    <ToolbarAutomaticTitleItem />
                    <FillSpace />
                    <ToolbarActions>
                        <SaveBoundarySaveButton />
                    </ToolbarActions>
                </StackToolbar>
                <StackMainContent>
                    <FieldSet>
                        <FinalForm
                            onSubmit={async () => {
                                // Submit data
                                await new Promise((resolve) => setTimeout(resolve, 1000));
                                alert("Form data submitted");
                            }}
                            mode="edit"
                        >
                            <TextField label="Title" placeholder="Title" name="title" fullWidth variant="horizontal" />
                            <TextAreaField name="description" placeholder="Description" label="Description" fullWidth variant="horizontal" />
                        </FinalForm>
                    </FieldSet>
                </StackMainContent>
            </SaveBoundary>
        );
    },
};

export const PredefinedButtonsExample = {
    decorators: [spacedElementsDecorator()],
    render: () => {
        return (
            <>
                <CancelButton />
                <DeleteButton />
                <OkayButton />
            </>
        );
    },
};
