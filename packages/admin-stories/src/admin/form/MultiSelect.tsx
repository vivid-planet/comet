import { Field, FinalFormMultiSelect } from "@comet/admin";
import { Check } from "@comet/admin-icons";
import { Box, Card, CardContent, FormLabel, ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const colorOptions = [
        { value: "red", label: "Red", icon: <div style={{ width: 20, height: 20, backgroundColor: "red" }} /> },
        { value: "green", label: "Green", icon: <div style={{ width: 20, height: 20, backgroundColor: "green" }} /> },
        { value: "blue", label: "Blue", icon: <div style={{ width: 20, height: 20, backgroundColor: "blue" }} /> },
    ];

    return (
        <div>
            <Form
                onSubmit={() => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box style={{ display: "flex", gap: "15px" }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <FormLabel>MultiSelect with ColorIcon</FormLabel>
                                    <Box width={200}>
                                        <Field name="multiSelectWithColorIcon" fullWidth>
                                            {(props) => (
                                                <FinalFormMultiSelect {...props}>
                                                    {colorOptions.map((colorOption, index) => (
                                                        <MenuItem value={colorOption.value} key={index}>
                                                            {(selected: boolean) => (
                                                                <>
                                                                    <ListItemIcon>{colorOption.icon}</ListItemIcon>
                                                                    <ListItemText>{colorOption.label}</ListItemText>
                                                                    {selected && <Check />}
                                                                </>
                                                            )}
                                                        </MenuItem>
                                                    ))}
                                                </FinalFormMultiSelect>
                                            )}
                                        </Field>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("MultiSelect", () => <Story />);
