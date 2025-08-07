import { Button, Field, FinalForm, FinalFormInput, RouterTab, RouterTabs, Stack, StackLink, StackPage, StackSwitch } from "@comet/admin";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

function Path() {
    const location = useLocation();
    const [, rerender] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            rerender(new Date().getTime());
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    return <div>{location.pathname}</div>;
}

export default {
    title: "@comet/admin/form",
    decorators: [storyRouterDecorator()],
};

export const RouterTabsInFormWithSubroutes = {
    render: () => {
        return (
            <>
                <Path />
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
                        <RouterTabs>
                            <RouterTab label="Form 1" path="" forceRender={true}>
                                <Field label="Foo" name="foo" component={FinalFormInput} />
                            </RouterTab>
                            <RouterTab label="Form 2" path="/form2" forceRender={true}>
                                <Field label="Bar" name="bar" component={FinalFormInput} />
                                <Stack topLevelTitle="">
                                    <StackSwitch initialPage="page1">
                                        <StackPage name="page1">
                                            Form 2 Subpage 1
                                            <StackLink pageName="page2" payload="test">
                                                <Button>To subpage 2</Button>
                                            </StackLink>
                                        </StackPage>
                                        <StackPage name="page2">Form 2 Subpage 2</StackPage>
                                    </StackSwitch>
                                </Stack>
                            </RouterTab>
                        </RouterTabs>
                    )}
                </FinalForm>
            </>
        );
    },

    name: "RouterTabsInFormWithSubroutes",
};
