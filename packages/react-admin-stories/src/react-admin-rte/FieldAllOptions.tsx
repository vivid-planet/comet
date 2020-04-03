import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { Field } from "@vivid-planet/react-admin-form";
import { createRteField } from "@vivid-planet/react-admin-rte";
import * as React from "react";
import { Form } from "react-final-form";
import { PrintAnything } from "./helper";
import { ContentFormat, defaultContent, makeApiOptions, rteOptions } from "./RteAllOptions";

const { RteField } = createRteField<ContentFormat>({
    rteApiOptions: makeApiOptions, // see ./RteAllOptions for details
    rteOptions, // see ./RteAllOptions for details
});

function Story() {
    const [submitedValue, setSubmittedValue] = React.useState<any>();

    return (
        <div style={{ width: "300px" }}>
            <Form
                initialValues={{
                    rteContent: defaultContent,
                }}
                onSubmit={values => {
                    //
                    setSubmittedValue(values);
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="rteContent" label="Rich Text" component={RteField} />
                        <Button type="submit" component={"button"} disableTouchRipple>
                            Submit
                        </Button>
                    </form>
                )}
            />
            <PrintAnything label="This has been submitted">{submitedValue}</PrintAnything>
        </div>
    );
}

storiesOf("react-admin-rte/field", module).add("Field, all options", () => <Story />);
