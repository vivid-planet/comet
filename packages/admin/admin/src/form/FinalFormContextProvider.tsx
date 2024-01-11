import * as React from "react";
import { FieldMetaState } from "react-final-form";

export interface FinalFormContext {
    shouldScrollToField: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
    shouldShowFieldError: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
    shouldShowFieldWarning: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
    shouldShowFieldHelperText: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
}

const defaultFinalFormContext: FinalFormContext = {
    shouldScrollToField: () => false,
    shouldShowFieldError: ({ fieldMeta }) => !!fieldMeta?.touched,
    shouldShowFieldWarning: ({ fieldMeta }) => !!fieldMeta?.touched,
    shouldShowFieldHelperText: ({ fieldMeta }) => !!fieldMeta?.touched,
};

const FinalFormContext = React.createContext<FinalFormContext>(defaultFinalFormContext);

export interface FinalFormContextProviderProps extends Partial<FinalFormContext> {
    children: React.ReactNode;
}

export function FinalFormContextProvider({ children, ...rest }: FinalFormContextProviderProps): React.ReactElement {
    return <FinalFormContext.Provider value={{ ...defaultFinalFormContext, ...rest }}>{children}</FinalFormContext.Provider>;
}

export function useFinalFormContext(): FinalFormContext {
    return React.useContext(FinalFormContext);
}
