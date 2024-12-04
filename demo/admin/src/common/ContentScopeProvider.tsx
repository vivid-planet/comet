import {
    ContentScopeConfigProps,
    ContentScopeProvider as ContentScopeProviderLibrary,
    ContentScopeProviderProps,
    ContentScopeValues,
    useContentScope as useContentScopeLibrary,
    UseContentScopeApi,
    useContentScopeConfig as useContentScopeConfigLibrary,
    useCurrentUser,
} from "@comet/cms-admin";

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

const ContentScopeProvider = ({ children }: Pick<ContentScopeProviderProps, "children">) => {
    const user = useCurrentUser();

    const userContentScopes = user.allowedContentScopes.filter(
        (value, index, self) => self.map((x) => JSON.stringify(x)).indexOf(JSON.stringify(value)) == index,
    ) as ContentScope[];

    const values: ContentScopeValues<ContentScope> = userContentScopes.map((contentScope) => ({
        domain: { value: contentScope.domain },
        language: { value: contentScope.language, label: contentScope.language.toUpperCase() },
    }));

    return (
        <ContentScopeProviderLibrary<ContentScope> values={values} defaultValue={{ domain: "main", language: "en" }}>
            {children}
        </ContentScopeProviderLibrary>
    );
};

export default ContentScopeProvider;
