import { createContext, type ReactNode, useContext } from "react";
import { type FieldRenderProps } from "react-final-form";

export interface FinalFormContext {
    shouldScrollToField: (fieldMeta: FieldRenderProps["meta"]) => boolean;
    shouldShowFieldError: (fieldMeta: FieldRenderProps["meta"]) => boolean;
    shouldShowFieldWarning: (fieldMeta: FieldRenderProps["meta"]) => boolean;
}

const defaultFinalFormContext: FinalFormContext = {
    shouldScrollToField: () => false,
    shouldShowFieldError: (fieldMeta) => !!fieldMeta?.touched,
    shouldShowFieldWarning: (fieldMeta) => !!fieldMeta?.touched,
};

const FinalFormContext = createContext<FinalFormContext>(defaultFinalFormContext);

export interface FinalFormContextProviderProps extends Partial<FinalFormContext> {
    children?: ReactNode;
}

export function FinalFormContextProvider({ children, ...rest }: FinalFormContextProviderProps) {
    return <FinalFormContext.Provider value={{ ...defaultFinalFormContext, ...rest }}>{children}</FinalFormContext.Provider>;
}

export function useFinalFormContext(): FinalFormContext {
    return useContext(FinalFormContext);
}
