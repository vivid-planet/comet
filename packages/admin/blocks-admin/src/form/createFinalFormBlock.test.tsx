import { Field, FinalForm, RouterMemoryRouter } from "@comet/admin";
import userEvent from "@testing-library/user-event";
import { render, screen } from "test-utils";

import { AdminComponentRoot } from "../blocks/common/AdminComponentRoot";
import { createListBlock } from "../blocks/factories/createListBlock";
import { createBlockSkeleton } from "../blocks/helpers/createBlockSkeleton";
import { BlockInterface } from "../blocks/types";
import { createFinalFormBlock } from "./createFinalFormBlock";

jest.mock("react-dnd", () => ({
    useDrop: jest.fn().mockImplementation(() => [undefined, jest.fn()]),
    useDrag: jest.fn().mockImplementation(() => [{}, jest.fn()]),
}));

describe("createFinalFormBlock", () => {
    describe("blocks with nested routes", () => {
        it("shouldn't show the dialog when the user navigates into the block", async () => {
            const Block: BlockInterface = {
                ...createBlockSkeleton(),
                name: "Test",
                defaultValues: () => ({}),
            };
            const ListBlock = createListBlock({ name: "List", block: Block });
            const FinalFormListBlock = createFinalFormBlock(ListBlock);

            const rendered = render(
                <RouterMemoryRouter>
                    <FinalForm
                        mode="edit"
                        onSubmit={() => {
                            // noop
                        }}
                        initialValues={{ links: ListBlock.defaultValues() }}
                    >
                        <AdminComponentRoot>
                            <Field name="links" component={FinalFormListBlock} fullWidth />
                        </AdminComponentRoot>
                    </FinalForm>
                </RouterMemoryRouter>,
            );

            userEvent.click(rendered.getByText("Add block"));

            expect(screen.queryByText("Do you want to save your changes?")).not.toBeInTheDocument();
        });
    });
});
