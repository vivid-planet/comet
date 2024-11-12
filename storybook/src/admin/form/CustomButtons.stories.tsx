import { Field, FinalForm, FinalFormInput } from "@comet/admin";
import { Master } from "@comet/admin-icons";
import { Box, Button, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useFormState } from "react-final-form";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";

const StyledButton = styled(Button)`
    text-transform: capitalize;
    background-color: #006699;
    color: white;

    &:disabled {
        color: lightgrey;
        background-color: slategrey;
    }

    &:hover {
        background-color: #006699;
    }
`;

const CustomButtons: React.FC = () => {
    const { values, pristine, hasValidationErrors, submitting } = useFormState();

    return (
        <StyledButton
            startIcon={<Master />}
            variant="text"
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

export default {
    title: "@comet/admin/form",
    decorators: [apolloRestStoryDecorator()],
};

export const _CustomButtons = () => {
    return (
        <div style={{ width: 300 }}>
            <FinalForm
                mode="edit"
                onSubmit={() => {
                    // add your form-submit function here
                }}
            >
                <Card variant="outlined">
                    <CardContent>
                        <Field label="Foo" name="foo" component={FinalFormInput} fullWidth />
                        <Field label="Bar" name="bar" component={FinalFormInput} fullWidth />
                    </CardContent>
                </Card>
                <Box paddingTop={4}>
                    <CustomButtons />
                </Box>
            </FinalForm>
        </div>
    );
};

_CustomButtons.storyName = "CustomButtons";
