import * as React from "react";

import { Preview } from "./Preview";

interface AdminMetaInterface {
    route: string;
}

export interface WithPreviewProps {
    data: WithPreviewPropsData;
}

export interface WithPreviewPropsData {
    adminMeta?: AdminMetaInterface;
}

export function isWithPreviewPropsData(block: unknown): block is WithPreviewPropsData {
    return (block as WithPreviewPropsData).adminMeta !== undefined;
}

interface PreviewOptions {
    label?: string;
    enabledChildrenAutoScrolling?: boolean;
}

interface AdminRouteContextOptions {
    parentRoute: string;
    parentEnabledAutoScrolling: boolean;
}
const AdminRouteContext = React.createContext<AdminRouteContextOptions>({
    parentRoute: "",
    parentEnabledAutoScrolling: true,
});

export const withPreview = <ComponentProps,>(
    Component: React.ComponentType<ComponentProps>,
    { label = "No type", enabledChildrenAutoScrolling = true }: PreviewOptions,
) => {
    return ({ ...componentProps }: WithPreviewProps & ComponentProps): React.ReactElement => {
        const { parentRoute, parentEnabledAutoScrolling } = React.useContext(AdminRouteContext);

        if (componentProps.data?.adminMeta && componentProps.data?.adminMeta.route !== parentRoute) {
            return (
                <AdminRouteContext.Provider
                    value={{
                        parentRoute: componentProps.data?.adminMeta.route,
                        parentEnabledAutoScrolling: !parentEnabledAutoScrolling ? false : enabledChildrenAutoScrolling,
                    }}
                >
                    <Preview adminRoute={componentProps.data?.adminMeta.route} label={label} enabledAutoScrolling={parentEnabledAutoScrolling}>
                        <Component {...componentProps} />
                    </Preview>
                </AdminRouteContext.Provider>
            );
        }

        return <Component {...componentProps} />;
    };
};
