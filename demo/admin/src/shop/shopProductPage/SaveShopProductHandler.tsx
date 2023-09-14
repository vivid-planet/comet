import React, { createContext, useContext } from "react";

type SaveShopProductHandlerContextType = {
    registerHandleSubmit: any;
    saveAll: () => Promise<void>;
};

export const SaveShopProductHandlerContext = createContext<SaveShopProductHandlerContextType | undefined>(undefined);

export function useSaveShopProductHandler(): SaveShopProductHandlerContextType {
    const context = useContext(SaveShopProductHandlerContext);
    if (!context) {
        throw new Error("useSaveShopProductHandler must be used within a SaveShopProductHandlerProvider");
    }
    return context;
}

export function SaveShopProductHandlerProvider({ children }: any) {
    const handleSubmitFunctions: (() => Promise<void>)[] = [];

    function registerHandleSubmit(handleSubmit: any) {
        handleSubmitFunctions.push(handleSubmit);
    }

    async function saveAll() {
        const savePromises = handleSubmitFunctions.map(async (handleSubmit) => {
            try {
                await handleSubmit();
            } catch (error) {
                console.error("Error saving form:", error);
            }
        });
        await Promise.all(savePromises);
    }

    const value = {
        registerHandleSubmit,
        saveAll,
    };

    return <SaveShopProductHandlerContext.Provider value={value}>{children}</SaveShopProductHandlerContext.Provider>;
}
