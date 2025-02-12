import { Field, FinalForm, FinalFormInput, Stack, StackBreadcrumbs, StackLink, StackPage, StackSwitch } from "@comet/admin";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/form",
    decorators: [storyRouterDecorator()],
};

export const StackInForm = {
    render: () => {
        return (
            <FinalForm
                mode="edit"
                onSubmit={(values: any) => {
                    alert(JSON.stringify(values));
                }}
                initialValues={{
                    foo: "foo",
                    bar: "bar",
                }}
            >
                {() => (
                    <Stack topLevelTitle="Stack">
                        <StackBreadcrumbs />
                        <StackSwitch>
                            <StackPage name="page1">
                                <Field label="Foo" name="foo" component={FinalFormInput} />
                                <StackLink pageName="page2" payload="xx">
                                    go to page2
                                </StackLink>
                            </StackPage>
                            <StackPage name="page2">
                                <Field label="Bar" name="bar" component={FinalFormInput} />
                            </StackPage>
                        </StackSwitch>
                    </Stack>
                )}
            </FinalForm>
        );
    },

    name: "StackInForm",
};
