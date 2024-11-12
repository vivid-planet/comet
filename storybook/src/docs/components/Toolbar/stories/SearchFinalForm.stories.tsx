import { Field, FinalFormInput, FinalFormSearchTextField, Toolbar, ToolbarItem } from "@comet/admin";
import { CometColor } from "@comet/admin-icons";
import * as React from "react";
import { Form } from "react-final-form";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Search Final Form",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const SearchFinalForm = () => {
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
};

export const SearchFinalFormCustomIcon = {
    render: () => {
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
    },

    name: "Search Final Form custom icon",
};

export const SearchFinalFormInput = () => {
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
};
