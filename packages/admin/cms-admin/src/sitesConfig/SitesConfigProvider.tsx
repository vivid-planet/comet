import * as React from "react";

import { SiteConfigApi, SiteConfigContext } from "./SitesConfigContext";

interface Props {
    children: React.ReactNode;
    value: SiteConfigApi;
}

export const SitesConfigProvider = ({ children, value }: Props): React.ReactElement => {
    return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
};
