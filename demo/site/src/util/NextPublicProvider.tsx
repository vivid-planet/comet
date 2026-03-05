"use client";

import { createContext, type PropsWithChildren, useContext } from "react";

export type NextPublicEnvs = Record<string, string>;

const NextPublicContext = createContext<NextPublicEnvs>({});

export function NextPublicProvider({ children, envs }: PropsWithChildren<{ envs: NextPublicEnvs }>) {
    return <NextPublicContext.Provider value={envs}>{children}</NextPublicContext.Provider>;
}

export function useNextPublic(key: string) {
    return useContext(NextPublicContext)[key];
}
