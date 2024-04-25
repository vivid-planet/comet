import { Domain as DomainIcon } from "@comet/admin-icons";
import {
    ContentScopeConfigProps,
    ContentScopeControls as ContentScopeControlsLibrary,
    ContentScopeControlsConfig,
    ContentScopeProvider as ContentScopeProviderLibrary,
    ContentScopeProviderProps,
    ContentScopeValues,
    useContentScope as useContentScopeLibrary,
    UseContentScopeApi,
    useContentScopeConfig as useContentScopeConfigLibrary,
    useCurrentUser,
    useSitesConfig,
} from "@comet/cms-admin";
import { SitesConfig } from "@src/config";
import React from "react";

type Domain = "main" | "secondary" | string;
type Language = "en" | string;
export interface ContentScope {
    domain: Domain;
    language: Language;
}

// convenince wrapper for app (Bind Generic)
export function useContentScope(): UseContentScopeApi<ContentScope> {
    return useContentScopeLibrary<ContentScope>();
}

const controlsConfig: ContentScopeControlsConfig<ContentScope> = {
    domain: {
        label: "Domain",
        icon: DomainIcon,
        searchable: true,
    },
    language: {
        label: "Language",
        icon: DomainIcon,
    },
};

// @TODO (maybe): make factory in library to statically create Provider and Controls

// convenince wrapper for app (Bind config and Generic)
export const ContentScopeControls: React.FC = () => {
    return <ContentScopeControlsLibrary<ContentScope> config={controlsConfig} />;
};

export function useContentScopeConfig(p: ContentScopeConfigProps): void {
    return useContentScopeConfigLibrary(p);
}

const ContentScopeProvider: React.FC<Pick<ContentScopeProviderProps, "children">> = ({ children }) => {
    const sitesConfig = useSitesConfig<SitesConfig>();
    const user = useCurrentUser();

    const allowedUserDomains = user.allowedContentScopes.map((scope) => scope.domain);

    const allowedSiteConfigs = Object.fromEntries(
        Object.entries(sitesConfig.configs).filter(([siteKey, siteConfig]) => allowedUserDomains.includes(siteKey)),
    );
    const values: ContentScopeValues<ContentScope> = {
        domain: Object.keys(allowedSiteConfigs).map((key) => ({ value: key })),
        language: [
            { label: "English", value: "en" },
            { label: "German", value: "de" },
        ],
    };

    return (
        <ContentScopeProviderLibrary<ContentScope> values={values} defaultValue={{ domain: Object.keys(allowedSiteConfigs)[0], language: "en" }}>
            {children}
        </ContentScopeProviderLibrary>
    );
};

export default ContentScopeProvider;
