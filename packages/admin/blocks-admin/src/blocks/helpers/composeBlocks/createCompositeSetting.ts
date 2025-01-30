import { AnonymousBlockInterface, BlockAdminComponent } from "../../types";
import { createSettingsAnonymousBlock } from "./createSettingsBlock";

interface Options<State> {
    defaultValue: State;
    AdminComponent: BlockAdminComponent<State>;
    definesOwnPadding?: boolean;
}

export function createCompositeSetting<State>({
    defaultValue,
    AdminComponent,
    definesOwnPadding,
}: Options<State>): [AnonymousBlockInterface<State, State, State, State>, { flatten: false }] {
    return [
        createSettingsAnonymousBlock<State>({
            defaultValues: defaultValue,
            AdminComponent,
            definesOwnPadding,
        }),

        { flatten: false },
    ];
}
