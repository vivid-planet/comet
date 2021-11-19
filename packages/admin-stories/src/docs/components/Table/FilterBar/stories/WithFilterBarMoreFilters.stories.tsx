import { Field, FilterBar, FilterBarMoreFilters, FilterBarPopoverFilter, FinalFormInput, FinalFormRangeInput } from "@comet/admin";
import { Box } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Table/FilterBar/FilterBar/With FilterBar More Filters", module).add("With FilterBar More Filters", () => {
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
                        <FilterBarMoreFilters>
                            <FilterBarPopoverFilter label={"Owner"}>
                                <Field label={"Firstname:"} name="owner.firstname" type="text" component={FinalFormInput} fullWidth />
                                <Field label={"Lastname:"} name="owner.lastname" type="text" component={FinalFormInput} fullWidth />
                            </FilterBarPopoverFilter>
                            <FilterBarPopoverFilter label={"Horsepower"}>
                                <Field name="horsepower" component={FinalFormRangeInput} fullWidth min={50} max={200} />
                            </FilterBarPopoverFilter>
                        </FilterBarMoreFilters>
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
