import { Field, FinalFormInput, FinalFormSelect } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { Grid, MenuItem } from "@mui/material";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const selectOptions = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];

    return (
        <Form
            onSubmit={() => {}}
            initialValues={{
                text: "Lorem ipsum",
                select: selectOptions[0].value,
                date: new Date(),
            }}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Field component={FinalFormInput} clearable fullWidth name="text" label="FinalFormInput" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Field name="select" label="FinalFormSelect" fullWidth>
                                {(props) => (
                                    <FinalFormSelect {...props} clearable>
                                        {selectOptions.map((option) => (
                                            <MenuItem value={option.value} key={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </FinalFormSelect>
                                )}
                            </Field>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Field component={FinalFormDatePicker} clearable fullWidth name="date" label="FinalFormDatePicker" />
                        </Grid>
                    </Grid>
                </form>
            )}
        </Form>
    );
}
export default Story;
