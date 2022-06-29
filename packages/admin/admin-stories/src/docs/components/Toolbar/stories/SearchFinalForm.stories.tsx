import { Field, FinalFormInput, FinalFormSearchTextField, Toolbar, ToolbarItem } from "@comet/admin";
import { CometColor } from "@comet/admin-icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Search Final Form", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
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
                                        placeholder="Comet Search"
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
    });
