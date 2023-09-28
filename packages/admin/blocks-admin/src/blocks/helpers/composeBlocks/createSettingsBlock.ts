import { createBlockSkeleton } from "../../helpers/createBlockSkeleton";
import { AnonymousBlockInterface, BlockAdminComponent } from "../../types";

interface Options<State> {
    defaultValues: State;
    AdminComponent: BlockAdminComponent<State>;
    isValid?: (values: State) => boolean | Promise<boolean>;
    definesOwnPadding?: boolean;
    extractTextContent?: boolean;
}

export function createSettingsAnonymousBlock<State>({
    defaultValues,
    AdminComponent,
    isValid,
    definesOwnPadding,
    extractTextContent,
}: Options<State>): AnonymousBlockInterface<State, State, State, State> {
    const AnonymousSettingsBlock: AnonymousBlockInterface<State, State, State, State> = {
        ...createBlockSkeleton(),

        defaultValues: () => defaultValues,

        input2State: (input) => copy(input),

        state2Output: (s) => copy(s),

        output2State: async (output) => Promise.resolve(copy(output)),

        createPreviewState: (state) => copy(state),

        definesOwnPadding,

        AdminComponent,
    };
    if (isValid) {
        AnonymousSettingsBlock.isValid = isValid;
    }
    if (extractTextContent) {
        AnonymousSettingsBlock.extractTextContents = (state) => {
            if (typeof state === "object") {
                if (state === null) {
                    return [];
                } else {
                    return Object.values(state).filter((value) => typeof value === "string");
                }
            } else if (typeof state === "string") {
                return [state];
            } else {
                return [];
            }
        };

        AnonymousSettingsBlock.replaceTextContents = (state, contents) => {
            if (typeof state === "object") {
                if (state === null) {
                    return state;
                } else {
                    return Object.values(state).filter(
                        (value) => contents.find((translation) => translation.original === value)?.replaceWith,
                    ) as State;
                }
            } else if (typeof state === "string") {
                return contents.find((translation) => translation.original === state)?.replaceWith as State;
            } else {
                return state;
            }
        };
    }

    return AnonymousSettingsBlock;
}

function copy<T = unknown>(value: T): T {
    if (typeof value === "object") {
        if (value === null) {
            return value;
        } else if (Array.isArray(value)) {
            return [...value] as unknown as T;
        } else {
            return { ...value };
        }
    } else {
        return value;
    }
}
