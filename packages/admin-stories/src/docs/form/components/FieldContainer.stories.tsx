import { FieldContainer } from "@comet/admin";
import { InputBase } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/Form/Components", module).add("FieldContainer", () => {
    const [value, setValue] = React.useState<string>("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    return (
        <form>
            <FieldContainer label="Normal">
                <InputBase onChange={handleChange} value={value} placeholder="Placeholder" />
            </FieldContainer>
            <FieldContainer label="Required" required>
                <InputBase onChange={handleChange} value={value} placeholder="Placeholder" />
            </FieldContainer>
            <FieldContainer label="Disabled" disabled>
                <InputBase onChange={handleChange} value={value} placeholder="Placeholder" disabled />
            </FieldContainer>
            <br />
            <FieldContainer label="Error" error="This is an error">
                <InputBase onChange={handleChange} value={value} placeholder="Placeholder" />
            </FieldContainer>
            <FieldContainer label="Warning" warning="This is a warning">
                <InputBase onChange={handleChange} value={value} placeholder="Placeholder" />
            </FieldContainer>
        </form>
    );
});
