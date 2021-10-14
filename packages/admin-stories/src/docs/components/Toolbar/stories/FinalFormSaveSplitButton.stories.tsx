import {
    Field,
    FinalForm,
    FinalFormInput,
    FormSaveSplitButton,
    MainContent,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarTitleItem,
    useStackApi,
    useStackSwitchApi,
} from "@comet/admin";
import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

import { apolloSwapiStoryDecorator } from "../../../../apollo-swapi-story.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Final Form Save Split Button", module)
    .addDecorator(apolloSwapiStoryDecorator())
    .addDecorator(toolbarDecorator())
    .addDecorator(StoryRouter())
    .add("Final Form Save Split Button", () => {
        function delay(ms: number) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        return (
            <FinalForm
                mode={"edit"}
                onSubmit={async (values, form) => {
                    // add your form-submit function here
                    console.log("saving async...");

                    await delay(500); // simulate asynchronous submitting

                    console.log("saving successful");
                }}
                onAfterSubmit={(values, form) => {
                    form.reset(values);
                }}
            >
                {({ handleSubmit }) => {
                    const stackSwitchApi = useStackSwitchApi();
                    const stackApi = useStackApi();
                    const canGoBack = stackApi && stackApi.breadCrumbs.length > 1;

                    return (
                        <>
                            <Toolbar>
                                <ToolbarBackButton />
                                <ToolbarTitleItem>Final Form Save Split Button</ToolbarTitleItem>
                                <ToolbarFillSpace />
                                <ToolbarActions>
                                    {canGoBack ? (
                                        <FormSaveSplitButton localStorageKey={"finalformsavesplitbutton"} />
                                    ) : (
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("automaticTitleDetail", "details");
                                            }}
                                        >
                                            <Typography>Go To Details</Typography>
                                        </Button>
                                    )}
                                </ToolbarActions>
                            </Toolbar>
                            {canGoBack && (
                                <MainContent>
                                    <Field label="Title" placeholder="Title" name="title" component={FinalFormInput} />
                                </MainContent>
                            )}
                        </>
                    );
                }}
            </FinalForm>
        );
    });
