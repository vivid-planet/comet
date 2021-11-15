import { Field, FilterBar, FilterBarPopoverFilter, FinalFormRangeInput, FinalFormSwitch } from "@comet/admin";
import { Box, Divider, FormControlLabel, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Filterbar/Multiple Fields In Popover Filter", module).add("Multiple Fields In Popover Filter", () => {
    return (
        <Form
            onSubmit={(values) => {
                // values
            }}
        >
            {({ values }) => (
                <>
                    <FilterBar>
                        <FilterBarPopoverFilter label={"Price"}>
                            <Box maxWidth={350}>
                                <Field name="price" component={FinalFormRangeInput} startAdornment={"€"} fullWidth min={50} max={1000} />
                                <Divider />
                                <Field name="expressDelivery" type="checkbox" fullWidth>
                                    {(props) => <FormControlLabel label={"Express delivery"} control={<FinalFormSwitch {...props} />} />}
                                </Field>
                                <Box paddingBottom={4} paddingLeft={4} paddingRight={4}>
                                    <Typography variant={"body2"}>
                                        Show all articles that can be shipped with express delivery (usually shipped within 2-3 work days)
                                    </Typography>
                                </Box>
                            </Box>
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
