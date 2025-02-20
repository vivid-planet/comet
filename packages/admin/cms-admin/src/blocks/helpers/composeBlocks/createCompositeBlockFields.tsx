/* eslint-disable @typescript-eslint/no-explicit-any */
<<<<<<< HEAD:packages/admin/cms-admin/src/blocks/helpers/composeBlocks/createCompositeBlockFields.tsx
import { type AnonymousBlockInterface, type BlockAdminComponent } from "../../types";
=======
import { AnonymousBlockInterface, BlockAdminComponent, BlockMethods } from "../../types";
>>>>>>> main:packages/admin/blocks-admin/src/blocks/helpers/composeBlocks/createCompositeSettings.tsx
import { createSettingsAnonymousBlock } from "./createSettingsBlock";

interface Options<State extends Record<string, any>> {
    defaultValues: State;
    AdminComponent: BlockAdminComponent<State>;
    definesOwnPadding?: boolean;
    extractTextContents?: BlockMethods["extractTextContents"];
}

export function createCompositeBlockFields<State extends Record<string, any>>({
    defaultValues,
    AdminComponent,
    definesOwnPadding,
    extractTextContents,
}: Options<State>): [AnonymousBlockInterface<State, State, State>, { flatten: true }] {
    return [
        createSettingsAnonymousBlock<State>({
            defaultValues,
            AdminComponent,
            definesOwnPadding,
            extractTextContents,
        }),
        { flatten: true },
    ];
}
