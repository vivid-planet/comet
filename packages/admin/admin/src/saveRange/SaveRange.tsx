import * as React from "react";
import { useIntl } from "react-intl";
import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

import { messages } from "../messages";
import { RouterPrompt } from "../router/Prompt";

export type SaveActionSuccess = boolean;
export interface SaveRangeApi {
    save: () => Promise<SaveActionSuccess>;
    register: (id: string, props: SaveRangeStateProps) => void;
    unregister: (id: string) => void;
}
export interface SaveRangeState {
    hasErrors: boolean;
    hasChanges: boolean;
    saving: boolean;
}

export const SaveRangeApiContext = React.createContext<SaveRangeApi | undefined>(undefined);
export function useSaveRangeApi() {
    return React.useContext(SaveRangeApiContext);
}

export const SaveRangeStateContext = React.createContext<SaveRangeState | undefined>(undefined);
export function useSaveRangeState() {
    return React.useContext(SaveRangeStateContext);
}

interface SaveRangeProps {
    children: React.ReactNode;
    subRoutePath?: string;
    onAfterSave?: () => void;
}

export function SaveRange({ onAfterSave, ...props }: SaveRangeProps) {
    const [saving, setSaving] = React.useState(false);
    const [hasErrors, setHasErrors] = React.useState(false);
    const [hasChanges, setHasChanges] = React.useState(false);
    const saveStates = React.useRef<Record<string, SaveRangeStateProps>>({});
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
        (id: string, props: SaveRangeStateProps) => {
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
            <SaveRangeStateContext.Provider
                value={{
                    hasErrors,
                    hasChanges,
                    saving,
                }}
            >
                <SaveRangeApiContext.Provider
                    value={{
                        save,
                        register,
                        unregister,
                    }}
                >
                    {props.children}
                </SaveRangeApiContext.Provider>
            </SaveRangeStateContext.Provider>
        </RouterPrompt>
    );
}

export interface SaveRangeStateProps {
    hasChanges: boolean;
    doSave: () => Promise<SaveActionSuccess> | SaveActionSuccess;
}

export function SaveRangeState({ doSave, hasChanges }: SaveRangeStateProps) {
    const id = useConstant<string>(() => uuid());
    const saveRangeApi = useSaveRangeApi();
    if (!saveRangeApi) throw new Error("SaveRangeState must be inside SaveRange");
    React.useEffect(() => {
        saveRangeApi.register(id, { doSave, hasChanges });
        return function cleanup() {
            saveRangeApi.unregister(id);
        };
    }, [id, doSave, hasChanges, saveRangeApi]);
    return null;
}
