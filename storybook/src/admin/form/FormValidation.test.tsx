import "@testing-library/jest-dom";

import { composeStory } from "@storybook/react";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { IntlDecorator } from "../../../.storybook/decorators/IntlProvider.decorator";
import { LayoutDecorator } from "../../../.storybook/decorators/Layout.decorator";
import { RouterDecorator } from "../../../.storybook/decorators/Router.decorator";
import { ThemeProviderDecorator } from "../../../.storybook/decorators/ThemeProvider.decorator";
import { FormValidation as FormValidationStory } from "./FormValidation.stories";

const FormValidation = composeStory(FormValidationStory, {
    decorators: [ThemeProviderDecorator, IntlDecorator, LayoutDecorator, RouterDecorator],
});

describe("FormValidation", () => {
    it("should show field level errors in TextField's helper text when submitting invalid form", async () => {
        const user = userEvent.setup();
        await FormValidation.run();
        const textFieldInputElement = screen.getByTestId("text-input");
        expect(textFieldInputElement).toBeInTheDocument();

        const saveButton = screen.getByTestId("saveButton");
        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeDisabled();

        await user.type(textFieldInputElement!, "Lorem ipsum");
        expect(textFieldInputElement).toHaveValue("Lorem ipsum");
        expect(saveButton).not.toBeDisabled();

        await user.click(saveButton);

        const textField2 = screen.getByTestId("text2-field-container-helper-texts-wrapper");
        expect(textField2).toBeInTheDocument();

        const isRequiredTextField2 = within(textField2).getByText("Required");
        expect(isRequiredTextField2).toBeInTheDocument();

        const textField3 = screen.getByTestId("text3-field-container-helper-texts-wrapper");
        expect(textField3).toBeInTheDocument();

        const isRequiredTextField3 = within(textField3).getByText("Required");
        expect(isRequiredTextField3).toBeInTheDocument();
    });
});
