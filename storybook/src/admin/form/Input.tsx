import { Field, FinalFormInput } from "@comet/admin";
import { Card, CardContent } from "@mui/material";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    return (
        <div style={{ width: 300 }}>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Card variant="outlined">
                            <CardContent>
                                <Field name="name" label="Foo" component={FinalFormInput} fullWidth />
                            </CardContent>
                        </Card>
                    </form>
                )}
            />
        </div>
    );
}

export default {
    title: "@comet/admin/form",
};

export const Input = () => <Story />;
