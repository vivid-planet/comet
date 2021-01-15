import { Field, FieldContainerLabelAbove, FinalFormInput } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import { Button, Divider, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { convertFromRaw, convertToRaw, RawDraftContentState } from "draft-js";
import isEqual = require("lodash.isequal");
import * as React from "react";
import { Form } from "react-final-form";

interface TestFormProps<RawContent = any> {
    api: ReturnType<typeof createFinalFormRte>;
    isEqualCheck: (a: RawContent, b: RawContent) => boolean;
}

// to correctly handle the dirty-state in a final form 2 things need to be considered:
//
// 1. set a correct default value
// the default value is not an empty string, it must match your representation of the rawContent,
// by default it is a stringified RawDraftContentState (can be an object, html or markdown too)
// whatever it is, use emptyContent() function to create an empty-raw-content
// if you do not care that the form is initially dirty with no content than this step can be omitted

//
// 2. implement a suitable isEqual function for the final-form field
// the default final-form implementation is (a === b) which is fine for strings
// when using the default RawContent (stringified RawDraftContentState), you need to do nothing (it is  astring)
// but in case your representation of the rawContent is an object ypu need to implement a suitable isEqual function (easiest is to use lodash.isequal)

function TestForm<RawContent>({ api: { RteField, RteReadOnly, emptyContent }, isEqualCheck }: TestFormProps<RawContent>) {
    const [submitedValue, setSubmittedValue] = React.useState<{ rteContent: any; somenthingElse: string }>({
        rteContent: emptyContent(), // set a default value so initial state is not dirty
        somenthingElse: "text initial value",
    });

    return (
        <div>
            <div style={{ maxWidth: "800px" }}>
                <Form
                    initialValues={submitedValue}
                    onSubmit={(values: any) => {
                        //
                        setSubmittedValue(values);
                    }}
                    render={({ handleSubmit, dirty }) => (
                        <>
                            is dirty ? {dirty ? "yes" : "no"}
                            <form onSubmit={handleSubmit}>
                                <Field
                                    name="rteContent"
                                    label="Rich Text"
                                    component={RteField}
                                    isEqual={isEqualCheck}
                                    fieldContainerComponent={FieldContainerLabelAbove}
                                />
                                <Field
                                    name="somenthingElse"
                                    label="Something else"
                                    component={FinalFormInput}
                                    fieldContainerComponent={FieldContainerLabelAbove}
                                />

                                <Button color="primary" variant="contained" type="submit" component={"button"} disableTouchRipple>
                                    <Typography variant="button">Submit</Typography>
                                </Button>
                            </form>
                        </>
                    )}
                />
            </div>
            <Typography variant="h5" color="primary">
                Readonly Component:
            </Typography>
            <RteReadOnly content={submitedValue.rteContent} />
        </div>
    );
}

function Story() {
    // setup a rte-field where it's raw content is an object
    const propsWithRawContentAsObject: TestFormProps<RawDraftContentState> = {
        api: createFinalFormRte<RawDraftContentState>({
            rteApiOptions: {
                format: convertToRaw,
                parse: convertFromRaw,
            },
        }),
        isEqualCheck: (a, b) => isEqual(a, b),
        // isEqualCheck: (a, b) => a === b, // would not work
    };
    // setup a rte-field where it's raw content is string (default implementation)
    const propsWithRawContentAsString: TestFormProps<string> = {
        api: createFinalFormRte<string>(/*use defaults */),
        isEqualCheck: (a, b) => a === b,
    };
    return (
        <div>
            <Typography variant="h3" color="primary">
                Raw Content is a string (=== works)
            </Typography>
            <TestForm<RawDraftContentState> {...propsWithRawContentAsObject} />
            <Divider />
            <Typography variant="h3" color="primary">
                Raw Content is an object (is_equal is needed to check equality)
            </Typography>
            <TestForm<string> {...propsWithRawContentAsString} />
        </div>
    );
}

storiesOf("@comet/admin-rte/field", module).add("Field test isDirty", () => <Story />);
