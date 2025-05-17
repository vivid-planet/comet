import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

import { messages } from "../messages";
import { RouterPrompt } from "../router/Prompt";

type SaveActionSuccess = boolean;
export interface SaveBoundaryApi {
    save: () => Promise<SaveActionSuccess>;
    register: (id: string, props: SavableProps) => void;
    unregister: (id: string) => void;
}
export interface SaveBoundaryState {
    hasErrors: boolean;
    hasChanges: boolean;
    saving: boolean;
}

export const SaveBoundaryApiContext = createContext<SaveBoundaryApi | undefined>(undefined);
export function useSaveBoundaryApi() {
    return useContext(SaveBoundaryApiContext);
}

const SaveBoundaryStateContext = createContext<SaveBoundaryState | undefined>(undefined);
export function useSaveBoundaryState() {
    return useContext(SaveBoundaryStateContext);
}

interface SaveBoundaryProps {
    subRoutePath?: string;
    onAfterSave?: () => void;
}

export const SaveBoundary = ({ onAfterSave, ...props }: PropsWithChildren<SaveBoundaryProps>) => {
    const [saving, setSaving] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const saveStates = useRef<Record<string, SavableProps>>({});
    const intl = useIntl();

    const subRoutePath = props.subRoutePath ?? "./save";

    const save = useCallback(async (): Promise<SaveActionSuccess> => {
        setHasErrors(false);
        setSaving(true);
        try {
            let saveSuccess = true;
            for (const state of Object.values(saveStates.current)) {
                const result = await state.doSave();
                if (!result) {
                    saveSuccess = false;
                }
            }
            if (!saveSuccess) {
                setHasErrors(true);
            } else {
                onAfterSave?.();
            }
            return saveSuccess;
        } catch (error: unknown) {
            setHasErrors(true);
            throw error;
        } finally {
            setSaving(false);
        }
    }, [onAfterSave]);

    const reset = useCallback(() => {
        for (const savable of Object.values(saveStates.current)) {
            savable.doReset?.();
        }
    }, []);

    const onSaveStatesChanged = useCallback(() => {
        const hasChanges = Object.values(saveStates.current).some((saveState) => saveState.hasChanges);
        setHasChanges(hasChanges);
    }, []);

    const register = useCallback(
        (id: string, props: SavableProps) => {
            saveStates.current[id] = props;
            onSaveStatesChanged();
        },
        [onSaveStatesChanged],
    );
    const unregister = useCallback(
        (id: string) => {
            delete saveStates.current[id];
            onSaveStatesChanged();
        },
        [onSaveStatesChanged],
    );

    return (
        <RouterPrompt
            message={() => {
                if (hasChanges) {
                    return intl.formatMessage(messages.saveUnsavedChanges);
                }
                return true;
            }}
            saveAction={save}
            resetAction={reset}
            subRoutePath={subRoutePath}
        >
            <SaveBoundaryStateContext.Provider
                value={{
                    hasErrors,
                    hasChanges,
                    saving,
                }}
            >
                <SaveBoundaryApiContext.Provider
                    value={{
                        save,
                        register,
                        unregister,
                    }}
                >
                    {props.children}
                </SaveBoundaryApiContext.Provider>
            </SaveBoundaryStateContext.Provider>
        </RouterPrompt>
    );
};

export interface SavableProps {
    hasChanges: boolean;
    doSave: () => Promise<SaveActionSuccess> | SaveActionSuccess;
    doReset?: () => void;
}

export const Savable = ({ doSave, doReset, hasChanges }: SavableProps) => {
    const id = useConstant<string>(() => uuid());
    const saveBoundaryApi = useSaveBoundaryApi();
    if (!saveBoundaryApi) throw new Error("Savable must be inside SaveBoundary");
    useEffect(() => {
        saveBoundaryApi.register(id, { doSave, doReset, hasChanges });
        return function cleanup() {
            saveBoundaryApi.unregister(id);
        };
    }, [id, doSave, doReset, hasChanges, saveBoundaryApi]);
    return null;
};
