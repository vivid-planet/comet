import {
    ContentScopeConfigProps,
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

// @TODO (maybe): make factory in library to statically create Provider

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

    const values: ContentScopeValues<ContentScope> = Object.keys(allowedSiteConfigs).flatMap((key) => {
        return [
            { domain: { value: key }, language: { label: "English", value: "en" } },
            { domain: { value: key }, language: { label: "German", value: "de" } },
        ];
    });

    return (
        <ContentScopeProviderLibrary<ContentScope> values={values} defaultValue={{ domain: Object.keys(allowedSiteConfigs)[0], language: "en" }}>
            {children}
        </ContentScopeProviderLibrary>
    );
};

export default ContentScopeProvider;
