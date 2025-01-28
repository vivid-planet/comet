import { render } from "test-utils";

import { FinalForm } from "../FinalForm";
import { TextField } from "../form/fields/TextField";
import { RouterPrompt } from "../router/Prompt";
import { StackPage } from "./Page";
import { Stack } from "./Stack";
import { StackLink } from "./StackLink";
import { StackSwitch } from "./Switch";

describe("StackSwitch", () => {
    describe("Switch in Form", () => {
        it("should prevent navigation", () => {
            const rendered = render(
                <FinalForm mode="edit" onSubmit={() => {}}>
                    <Stack topLevelTitle="Root">
                        <StackSwitch>
                            <StackPage name="page1">
                                <TextField name="test" />
                                <StackLink pageName="page2" payload="test">
                                    Navigate
                                </StackLink>
                            </StackPage>
                            <StackPage name="page2">Page 2</StackPage>
                        </StackSwitch>
                    </Stack>
                    ,
                </FinalForm>,
            );

            rendered.getByText("Navigate").click();

            expect(rendered.queryByText("Page 2")).not.toBeInTheDocument();
            expect(rendered.queryByText("Are you sure?")).toBeInTheDocument();
        });

        it("should allow navigation when using disableForcePromptRoute", () => {
            const rendered = render(
                <Stack topLevelTitle="Root">
                    <StackSwitch disableForcePromptRoute>
                        <StackPage name="page1">
                            <RouterPrompt message={() => "Are you sure?"}>
                                <StackLink pageName="page2" payload="test">
                                    Navigate
                                </StackLink>
                            </RouterPrompt>
                        </StackPage>
                        <StackPage name="page2">Page 2</StackPage>
                    </StackSwitch>
                </Stack>,
            );

            rendered.getByText("Navigate").click();

            expect(rendered.queryByText("Page 2")).toBeInTheDocument();
            expect(rendered.queryByText("Are you sure?")).not.toBeInTheDocument();
        });
    });
});
