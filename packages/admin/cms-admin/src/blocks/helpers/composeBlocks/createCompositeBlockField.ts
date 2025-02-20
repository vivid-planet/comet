<<<<<<< HEAD:packages/admin/cms-admin/src/blocks/helpers/composeBlocks/createCompositeBlockField.ts
import { type AnonymousBlockInterface, type BlockAdminComponent } from "../../types";
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnonymousBlockInterface, BlockAdminComponent, BlockMethods } from "../../types";
>>>>>>> main:packages/admin/blocks-admin/src/blocks/helpers/composeBlocks/createCompositeSetting.ts
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
