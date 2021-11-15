import { Field, FilterBar, FilterBarPopoverFilter, FinalFormInput } from "@comet/admin";
import { Box } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Filterbar/Default", module).add("Default", () => {
    return (
        <Form
            onSubmit={(values) => {
                // values
            }}
        >
            {({ values }) => (
                <>
                    <FilterBar>
                        <FilterBarPopoverFilter label={"Brand"}>
                            <Field label={"Brandname:"} name="brand" type="text" component={FinalFormInput} fullWidth />
                        </FilterBarPopoverFilter>
                        <FilterBarPopoverFilter label={"Model"}>
                            <Field label={"Modelname:"} name="model" type="text" component={FinalFormInput} fullWidth />
                        </FilterBarPopoverFilter>
                    </FilterBar>
                    <Box style={{ minHeight: "150px" }}>
                        <h3>Wrapping Form Values</h3>
                        <pre>{JSON.stringify(values, undefined, 2)}</pre>
                    </Box>
                </>
            )}
        </Form>
    );
});
