import * as React from "react";
import { useIntl } from "react-intl";
import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

import { messages } from "../messages";
import { RouterPrompt } from "../router/Prompt";

export type SaveActionSuccess = boolean;
export interface SaveBoundaryApi {
    save: () => Promise<SaveActionSuccess>;
    register: (id: string, props: SaveableProps) => void;
    unregister: (id: string) => void;
}
export interface Saveable {
    hasErrors: boolean;
    hasChanges: boolean;
    saving: boolean;
}

export const SaveBoundaryApiContext = React.createContext<SaveBoundaryApi | undefined>(undefined);
export function useSaveBoundaryApi() {
    return React.useContext(SaveBoundaryApiContext);
}

export const SaveableContext = React.createContext<Saveable | undefined>(undefined);
export function useSaveable() {
    return React.useContext(SaveableContext);
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
    const saveStates = React.useRef<Record<string, SaveableProps>>({});
    const intl = useIntl();

    const save = React.useCallback(async (): Promise<SaveActionSuccess> => {
        setHasErrors(false);
        setSaving(true);
        try {
            const saveSuccess = !(
                await Promise.all(
                    Object.values(saveStates.current).map((state) => {
                        return state.doSave();
                    }),
                )
            ).some((saveSuccess) => !saveSuccess);
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

    const onSaveStatesChanged = React.useCallback(() => {
        const hasChanges = Object.values(saveStates.current).some((saveState) => saveState.hasChanges);
        setHasChanges(hasChanges);
    }, []);

    const register = React.useCallback(
        (id: string, props: SaveableProps) => {
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
            subRoutePath={props.subRoutePath}
        >
            <SaveableContext.Provider
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
            </SaveableContext.Provider>
        </RouterPrompt>
    );
}

export interface SaveableProps {
    hasChanges: boolean;
    doSave: () => Promise<SaveActionSuccess> | SaveActionSuccess;
}

export function Saveable({ doSave, hasChanges }: SaveableProps) {
    const id = useConstant<string>(() => uuid());
    const saveBoundaryApi = useSaveBoundaryApi();
    if (!saveBoundaryApi) throw new Error("Saveable must be inside SaveBoundary");
    React.useEffect(() => {
        saveBoundaryApi.register(id, { doSave, hasChanges });
        return function cleanup() {
            saveBoundaryApi.unregister(id);
        };
    }, [id, doSave, hasChanges, saveBoundaryApi]);
    return null;
}
