import { Field, FinalForm, FinalFormInput, FormPaper } from "@comet/admin";
import { Button } from "@material-ui/core";
import { BeachAccess as BeachAccessIcon } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { AnyObject } from "react-final-form";
import styled from "styled-components";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

interface IProps {
    formRenderProps: AnyObject;
}

const StyledButton = styled(Button)`
    && {
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
    }
`;

const CustomButtons: React.FC<IProps> = ({ formRenderProps }) => {
    return (
        <StyledButton
            startIcon={<BeachAccessIcon />}
            variant="text"
            color="default"
            disabled={formRenderProps.pristine || formRenderProps.hasValidationErrors || formRenderProps.submitting}
            onClick={handleCustomButtonClick}
        >
            {formRenderProps.pristine ? "Please fill out the form" : "Click Me - I'm a Custom button"}
        </StyledButton>
    );

    function handleCustomButtonClick() {
        window.alert(`Form values: ${JSON.stringify(formRenderProps.values)}`);
    }
};

function Story() {
    return (
        <FinalForm
            mode={"edit"}
            onSubmit={() => {
                // add your form-submit function here
            }}
            renderButtons={(props) => <CustomButtons formRenderProps={props} />}
        >
            <FormPaper>
                <Field label="Foo" name="foo" component={FinalFormInput} />
                <Field label="Bar" name="bar" component={FinalFormInput} />
            </FormPaper>
        </FinalForm>
    );
}

storiesOf("@comet/admin/form", module)
    .addDecorator(apolloStoryDecorator())
    .add("CustomButtons", () => <Story />);
