import * as React from "react";
import { useIntl } from "react-intl";
import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

import { messages } from "../messages";
import { RouterPrompt } from "../router/Prompt";

export type SaveActionSuccess = boolean;
export interface SaveBoundaryApi {
    save: () => Promise<SaveActionSuccess>;
    register: (id: string, props: SavableProps) => void;
    unregister: (id: string) => void;
}
export interface Savable {
    hasErrors: boolean;
    hasChanges: boolean;
    saving: boolean;
}

export const SaveBoundaryApiContext = React.createContext<SaveBoundaryApi | undefined>(undefined);
export function useSaveBoundaryApi() {
    return React.useContext(SaveBoundaryApiContext);
}

export const SavableContext = React.createContext<Savable | undefined>(undefined);
export function useSavable() {
    return React.useContext(SavableContext);
}

interface SaveBoundaryProps {
    children: React.ReactNode;
    subRoutePath?: string;
    onAfterSave?: () => void;
}

export function SaveBoundary({ onAfterSave, ...props }: SaveBoundaryProps) {
    const [saving, setSaving] = React.useState(false);
    const [hasErrors, setHasErrors] = React.useState(false);
    const [hasChanges, setHasChanges] = React.useState(false);
    const saveStates = React.useRef<Record<string, SavableProps>>({});
    const intl = useIntl();

    const subRoutePath = props.subRoutePath ?? "./save";

    const save = React.useCallback(async (): Promise<SaveActionSuccess> => {
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

    const reset = React.useCallback(() => {
        for (const savable of Object.values(saveStates.current)) {
            savable.doReset?.();
        }
    }, []);

    const onSaveStatesChanged = React.useCallback(() => {
        const hasChanges = Object.values(saveStates.current).some((saveState) => saveState.hasChanges);
        setHasChanges(hasChanges);
    }, []);

    const register = React.useCallback(
        (id: string, props: SavableProps) => {
            saveStates.current[id] = props;
            onSaveStatesChanged();
        },
        [onSaveStatesChanged],
    );
    const unregister = React.useCallback(
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
            <SavableContext.Provider
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
            </SavableContext.Provider>
        </RouterPrompt>
    );
}

export interface SavableProps {
    hasChanges: boolean;
    doSave: () => Promise<SaveActionSuccess> | SaveActionSuccess;
    doReset?: () => void;
}

export function Savable({ doSave, doReset, hasChanges }: SavableProps) {
    const id = useConstant<string>(() => uuid());
    const saveBoundaryApi = useSaveBoundaryApi();
    if (!saveBoundaryApi) throw new Error("Savable must be inside SaveBoundary");
    React.useEffect(() => {
        saveBoundaryApi.register(id, { doSave, doReset, hasChanges });
        return function cleanup() {
            saveBoundaryApi.unregister(id);
        };
    }, [id, doSave, doReset, hasChanges, saveBoundaryApi]);
    return null;
}
