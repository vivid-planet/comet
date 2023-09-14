import { FormApi } from "final-form";
import * as React from "react";
import { createContext, useContext } from "react";

type SaveShopProductHandlerContextType = {
    registerForm: (form: FormApi<any>) => void;
    saveAllForms: () => Promise<void>;
};

export const SaveShopProductHandlerContext = createContext<SaveShopProductHandlerContextType | undefined>(undefined);

export function useSaveShopProductHandler(): SaveShopProductHandlerContextType {
    const context = useContext(SaveShopProductHandlerContext);
    if (!context) {
        throw new Error("useSaveShopProductHandler must be used within a SaveShopProductHandlerProvider");
    }
    return context;
}

interface SaveShopProductHandlerProviderProps {
    children: React.ReactNode;
}

export function SaveShopProductHandlerProvider({ children }: SaveShopProductHandlerProviderProps): JSX.Element {
    const forms: FormApi<any>[] = [];

    async function registerForm(form: FormApi<any>) {
        console.log(`Registering form ${form}`);
        forms.push(form);
    }

    async function saveAllForms() {
        const savePromises = forms.map(async (form) => {
            try {
                await form.submit();
            } catch (error) {
                console.error("Error saving form:", error);
            }
        });
        await Promise.all(savePromises);
    }

    const value = {
        registerForm,
        saveAllForms,
    };

    return <SaveShopProductHandlerContext.Provider value={value}>{children}</SaveShopProductHandlerContext.Provider>;
}
