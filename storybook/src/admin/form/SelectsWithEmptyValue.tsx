import { AsyncSelectField, Field, FinalFormSelect, SelectField } from "@comet/admin";
import { Box, Button, Divider, MenuItem, Stack, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

interface OptionWithId {
    id: string;
    title: string;
}

const optionsWithId: OptionWithId[] = [
    { id: "", title: "No Value" },
    { id: "chocolate", title: "Chocolate" },
    { id: "strawberry", title: "Strawberry" },
    { id: "vanilla", title: "Vanilla" },
];

interface OptionWithValue {
    value: string;
    title: string;
}

const optionsWithValue: OptionWithValue[] = [
    { value: "", title: "No Value" },
    { value: "chocolate", title: "Chocolate" },
    { value: "strawberry", title: "Strawberry" },
    { value: "vanilla", title: "Vanilla" },
];

storiesOf("@comet/admin/form", module).add("Selects with empty values", () => {
    return (
        <Form
            mode="edit"
            onSubmit={(values) => {
                alert(JSON.stringify(values, null, 4));
            }}
            initialValues={{}}
            render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <Stack direction="row" spacing={8}>
                        <Stack spacing={8} width={400}>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Selects using options object with id
                                </Typography>
                                <AsyncSelectField
                                    fullWidth
                                    name="asyncSelectFieldId"
                                    label="AsyncSelectField (ID)"
                                    loadOptions={async () => {
                                        return optionsWithId;
                                    }}
                                    getOptionLabel={(option: OptionWithId) => option.title}
                                />
                                <SelectField name="selectFieldId" label="SelectField (ID)" fullWidth>
                                    {optionsWithId.map((option: OptionWithId) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.title}
                                        </MenuItem>
                                    ))}
                                </SelectField>
                                <Field name="finalFormSelectId" label="FinalFormSelect (ID)" fullWidth>
                                    {(props) => (
                                        <FinalFormSelect
                                            {...props}
                                            options={optionsWithId}
                                            getOptionLabel={(option: OptionWithId) => option.title}
                                            getOptionSelected={(option: OptionWithId, value: OptionWithId) => option.title === value.title}
                                            fullWidth
                                        />
                                    )}
                                </Field>
                            </Box>
                            <Divider />
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Selects using options object with custom value key
                                </Typography>
                                <AsyncSelectField
                                    fullWidth
                                    name="asyncSelectFieldValue"
                                    label="AsyncSelectField (VALUE)"
                                    loadOptions={async () => {
                                        return optionsWithValue;
                                    }}
                                    getOptionLabel={(option: OptionWithValue) => option.title}
                                />
                                <SelectField name="selectFieldValue" label="SelectField (VALUE)" fullWidth>
                                    {optionsWithValue.map((option: OptionWithValue) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.title}
                                        </MenuItem>
                                    ))}
                                </SelectField>
                                <Field name="finalFormSelectValue" label="FinalFormSelect (VALUE)" fullWidth>
                                    {(props) => (
                                        <FinalFormSelect
                                            {...props}
                                            options={optionsWithValue}
                                            getOptionLabel={(option: OptionWithValue) => option.title}
                                            getOptionSelected={(option: OptionWithValue, value: OptionWithValue) => option.title === value.title}
                                            fullWidth
                                        />
                                    )}
                                </Field>
                            </Box>
                            <Button color="primary" variant="contained" type="submit">
                                Submit
                            </Button>
                        </Stack>
                        <Box component="pre" sx={{ width: 300 }}>
                            {JSON.stringify({ values }, null, 2)}
                        </Box>
                    </Stack>
                </form>
            )}
        />
    );
});
