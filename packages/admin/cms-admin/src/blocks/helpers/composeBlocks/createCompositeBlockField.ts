import { type AnonymousBlockInterface, type BlockAdminComponent, type BlockMethods } from "../../types";
import { createSettingsAnonymousBlock } from "./createSettingsBlock";

interface Options<State> {
    defaultValue: State;
    AdminComponent: BlockAdminComponent<State>;
    definesOwnPadding?: boolean;
    extractTextContents?: BlockMethods["extractTextContents"];
}

export function createCompositeBlockField<State>({
    defaultValue,
    AdminComponent,
    definesOwnPadding,
    extractTextContents,
}: Options<State>): [AnonymousBlockInterface<State, State, State, State>, { flatten: false }] {
    return [
        createSettingsAnonymousBlock<State>({
            defaultValues: defaultValue,
            AdminComponent,
            definesOwnPadding,
            extractTextContents,
        }),

        { flatten: false },
    ];
}
