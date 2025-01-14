"use client";

import { createContext, PropsWithChildren, useContext } from "react";

import { Preview } from "./Preview";

interface AdminMetaInterface {
    route: string;
}

export interface WithPreviewProps<Data> {
    data: WithPreviewPropsData<Data>;
}

type WithPreviewPropsData<Data> = Data & {
    adminMeta?: AdminMetaInterface;
};

export function isWithPreviewPropsData(block: unknown): block is WithPreviewPropsData<unknown> {
    return (block as WithPreviewPropsData<unknown>).adminMeta !== undefined;
}

interface PreviewOptions {
    label?: string;
    enabledChildrenAutoScrolling?: boolean;
}

interface AdminRouteContextOptions {
    parentRoute: string;
    parentEnabledAutoScrolling: boolean;
}
const AdminRouteContext = createContext<AdminRouteContextOptions>({
    parentRoute: "",
    parentEnabledAutoScrolling: true,
});

type WithPreviewComponentProps<Data> = WithPreviewProps<Data> & PreviewOptions;

export function WithPreviewComponent<Data>({
    label = "No type",
    enabledChildrenAutoScrolling = true,
    children,
    data,
}: PropsWithChildren<WithPreviewComponentProps<Data>>) {
    const { parentRoute, parentEnabledAutoScrolling } = useContext(AdminRouteContext);
    if (data?.adminMeta && data?.adminMeta.route !== parentRoute) {
        return (
            <AdminRouteContext.Provider
                value={{
                    parentRoute: data?.adminMeta.route,
                    parentEnabledAutoScrolling: !parentEnabledAutoScrolling ? false : enabledChildrenAutoScrolling,
                }}
            >
                <Preview adminRoute={data?.adminMeta.route} label={label} enabledAutoScrolling={parentEnabledAutoScrolling}>
                    {children}
                </Preview>
            </AdminRouteContext.Provider>
        );
    }
    return <>{children}</>;
}
