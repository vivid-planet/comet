import { Field, FinalForm, FinalFormInput, Tab, Tabs } from "@comet/admin";
import { Button, Card, CardContent } from "@mui/material";
import * as React from "react";

export default {
    title: "@comet/admin/form",
};

export const _Tabs = () => {
    const [showExample3, setShowExample3] = React.useState(false);

    return (
        <>
            <Button onClick={() => setShowExample3((value) => !value)}>{showExample3 ? "Hide" : "Show"} Example 3</Button>
            <FinalForm
                mode="edit"
                onSubmit={(values) => {
                    alert(JSON.stringify(values));
                }}
                initialValues={{
                    foo: "foo",
                    bar: "bar",
                }}
            >
                <Tabs>
                    <Tab label="Example 1">
                        <Card variant="outlined">
                            <CardContent>
                                <Field label="Foo" name="foo" component={FinalFormInput} />
                            </CardContent>
                        </Card>
                    </Tab>
                    <Tab label="Example 2" forceRender>
                        <Card variant="outlined">
                            <CardContent>
                                <Field label="Bar" name="bar" component={FinalFormInput} />
                            </CardContent>
                        </Card>
                    </Tab>
                    {showExample3 && (
                        <Tab label="Example 3">
                            <Card variant="outlined">
                                <CardContent>False</CardContent>
                            </Card>
                        </Tab>
                    )}
                </Tabs>
            </FinalForm>
        </>
    );
};