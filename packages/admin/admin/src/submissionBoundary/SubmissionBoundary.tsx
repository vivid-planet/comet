import * as React from "react";
import { useIntl } from "react-intl";
import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

import { messages } from "../messages";
import { RouterPrompt } from "../router/Prompt";

export type SaveActionSuccess = boolean;
export interface SubmissionBoundaryApi {
    save: () => Promise<SaveActionSuccess>;
    register: (id: string, props: SubmissionBoundaryStateProps) => void;
    unregister: (id: string) => void;
}
export interface SubmissionBoundaryState {
    hasErrors: boolean;
    hasChanges: boolean;
    saving: boolean;
}

export const SubmissionBoundaryApiContext = React.createContext<SubmissionBoundaryApi | undefined>(undefined);
export function useSubmissionBoundaryApi() {
    return React.useContext(SubmissionBoundaryApiContext);
}

export const SubmissionBoundaryStateContext = React.createContext<SubmissionBoundaryState | undefined>(undefined);
export function useSubmissionBoundaryState() {
    return React.useContext(SubmissionBoundaryStateContext);
}

interface SubmissionBoundaryProps {
    children: React.ReactNode;
    subRoutePath?: string;
    onAfterSave?: () => void;
}

export function SubmissionBoundary({ onAfterSave, ...props }: SubmissionBoundaryProps) {
    const [saving, setSaving] = React.useState(false);
    const [hasErrors, setHasErrors] = React.useState(false);
    const [hasChanges, setHasChanges] = React.useState(false);
    const saveStates = React.useRef<Record<string, SubmissionBoundaryStateProps>>({});
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
        (id: string, props: SubmissionBoundaryStateProps) => {
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
            <SubmissionBoundaryStateContext.Provider
                value={{
                    hasErrors,
                    hasChanges,
                    saving,
                }}
            >
                <SubmissionBoundaryApiContext.Provider
                    value={{
                        save,
                        register,
                        unregister,
                    }}
                >
                    {props.children}
                </SubmissionBoundaryApiContext.Provider>
            </SubmissionBoundaryStateContext.Provider>
        </RouterPrompt>
    );
}

export interface SubmissionBoundaryStateProps {
    hasChanges: boolean;
    doSave: () => Promise<SaveActionSuccess> | SaveActionSuccess;
}

export function SubmissionBoundaryState({ doSave, hasChanges }: SubmissionBoundaryStateProps) {
    const id = useConstant<string>(() => uuid());
    const submissionBoundaryApi = useSubmissionBoundaryApi();
    if (!submissionBoundaryApi) throw new Error("SubmissionBoundaryState must be inside SubmissionBoundary");
    React.useEffect(() => {
        submissionBoundaryApi.register(id, { doSave, hasChanges });
        return function cleanup() {
            submissionBoundaryApi.unregister(id);
        };
    }, [id, doSave, hasChanges, submissionBoundaryApi]);
    return null;
}
