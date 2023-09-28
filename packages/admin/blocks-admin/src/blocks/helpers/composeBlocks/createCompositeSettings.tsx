/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnonymousBlockInterface, BlockAdminComponent } from "../../types";
import { createSettingsAnonymousBlock } from "./createSettingsBlock";

interface Options<State extends Record<string, any>> {
    defaultValues: State;
    AdminComponent: BlockAdminComponent<State>;
    definesOwnPadding?: boolean;
    extractTextContent?: boolean;
}

export function createCompositeSettings<State extends Record<string, any>>({
    defaultValues,
    AdminComponent,
    definesOwnPadding,
    extractTextContent,
}: Options<State>): [AnonymousBlockInterface<State, State, State>, { flatten: true }] {
    return [
        createSettingsAnonymousBlock<State>({
            defaultValues,
            AdminComponent,
            definesOwnPadding,
            extractTextContent,
        }),
        { flatten: true },
    ];
}
