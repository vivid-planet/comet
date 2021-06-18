import { Field, FinalForm, FinalFormInput, FormPaper } from "@comet/admin";
import { Box, Button, withStyles } from "@material-ui/core";
import { BeachAccess as BeachAccessIcon } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { useFormState } from "react-final-form";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

const StyledButton = withStyles({
    root: {
        textTransform: "capitalize",
        backgroundColor: "#006699",
        color: "white",
        "&:disabled": {
            color: "lightgrey",
            backgroundColor: "slategrey",
        },
        "&:hover": {
            backgroundColor: "#006699",
        },
    },
})(Button);

const CustomButtons: React.FC = () => {
    const { values, pristine, hasValidationErrors, submitting } = useFormState();

    return (
        <StyledButton
            startIcon={<BeachAccessIcon />}
            variant="text"
            color="default"
            disabled={pristine || hasValidationErrors || submitting}
            onClick={handleCustomButtonClick}
        >
            {pristine ? "Please fill out the form" : "Click Me - I'm a Custom button"}
        </StyledButton>
    );

    function handleCustomButtonClick() {
        window.alert(`Form values: ${JSON.stringify(values)}`);
    }
};

function Story() {
    return (
        <div style={{ width: 300 }}>
            <FinalForm
                mode={"edit"}
                onSubmit={() => {
                    // add your form-submit function here
                }}
            >
                <FormPaper variant="outlined">
                    <Field label="Foo" name="foo" component={FinalFormInput} fullWidth />
                    <Field label="Bar" name="bar" component={FinalFormInput} fullWidth />
                </FormPaper>
                <Box paddingTop={4}>
                    <CustomButtons />
                </Box>
            </FinalForm>
        </div>
    );
}

storiesOf("@comet/admin/form", module)
    .addDecorator(apolloStoryDecorator())
    .add("CustomButtons", () => <Story />);
