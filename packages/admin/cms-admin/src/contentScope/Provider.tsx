import { createContext, type Dispatch, type ReactNode, type SetStateAction, useCallback, useContext, useMemo, useState } from "react";
import { type match, Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router";

import { defaultCreatePath } from "./utils/defaultCreatePath";

export interface ContentScope {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

type ContentScopeLocation = {
    createPath: (scope: ContentScopeValues) => string | string[];
    createUrl: (scope: ContentScope) => string;
};

const defaultContentScopeLocation = { createPath: defaultCreatePath, createUrl: defaultCreateUrl };

interface ContentScopeContext {
    path: string | string[];
    redirectPathAfterChange?: string; // define where the user should be redirected to after a scope change
    setRedirectPathAfterChange: Dispatch<SetStateAction<string | undefined>>;
    values: ContentScopeValues;
    location: ContentScopeLocation;
}

const defaultContentScopeContext: ContentScopeContext = {
    path: "/",
    setRedirectPathAfterChange: () => {
        //
    },
    values: [],
    location: defaultContentScopeLocation,
};

type NonNull<T> = T extends null ? never : T;
type NonNullRecord<T> = {
    [P in keyof T]: NonNull<T[P]>;
};

type SetContentScopeAction = (state: ContentScope) => ContentScope;

export type UseContentScopeApi = {
    scope: ContentScope;
    setScope: (action: SetContentScopeAction) => void;
    match: match;
    setRedirectPathAfterChange: Dispatch<SetStateAction<string | undefined>>;
    supported: boolean;
    createUrl: (scope: ContentScope) => string;
    values: ContentScopeValues;
};

export type ContentScopeValues = Array<{
    scope: ContentScope;
    label?: { [P in keyof ContentScope]?: string };
}>;

// @TODO (maybe): factory for Provider (and other components) to be able to create a generic context https://ordina-jworks.github.io/architecture/2021/02/12/react-generic-context.html
// ... and get rid of "as" type-assertions
const Context = createContext<ContentScopeContext>(defaultContentScopeContext);

const NullValueAsString = "-"; // used to represent null-values in the url

function parseScopeFromRouterMatchParams(params: NonNullRecord<ContentScope>): ContentScope {
    return Object.entries(params).reduce((a, [key, value]) => {
        return {
            ...a,
            [key]: !value || value === NullValueAsString ? null : value,
        };
    }, {} as ContentScope);
}

function formatScopeToRouterMatchParams(scope: Partial<ContentScope>): NonNullRecord<ContentScope> {
    return Object.entries(scope).reduce((a, [key, value]) => {
        return {
            ...a,
            [key]: !value || value === null ? NullValueAsString : value,
        };
    }, {} as NonNullRecord<ContentScope>);
}

function defaultCreateUrl(scope: ContentScope) {
    const formattedMatchParams = formatScopeToRouterMatchParams(scope);
    return Object.entries(formattedMatchParams).reduce((a, [, value]) => `${a}/${value}`, "");
}

// @TODO: scope can no longer be undefined
// @TODO: remove supported attribute
// @TODO: provide default empty scope "{}"
export function useContentScope(): UseContentScopeApi {
    const context = useContext(Context);
    const history = useHistory();
    const matchContextScope = useRouteMatch<NonNullRecord<ContentScope>>(context?.path || "");
    const matchDefault = useRouteMatch();
    const match = matchContextScope || matchDefault;

    const matchParamsString = JSON.stringify(match.params); // convert matchParams to string, like this we can memoize or callbacks more easily
    const scope = useMemo(() => parseScopeFromRouterMatchParams(JSON.parse(matchParamsString)), [matchParamsString]);
    const redirectPath = context.redirectPathAfterChange;
    const setScope = useCallback(
        (action: SetContentScopeAction) => {
            const newContentScope = action(scope);
            const pathAfterScopePath = redirectPath || "";
            const url = context.location.createUrl(newContentScope);
            history.push({ pathname: url + pathAfterScopePath });
        },
        [scope, history, redirectPath, context.location],
    );

    return {
        scope,
        setScope,
        match,
        setRedirectPathAfterChange: context.setRedirectPathAfterChange,
        supported: Object.keys(scope).length > 0,
        values: context.values as ContentScopeValues, // @TODO:
        createUrl: context.location.createUrl,
    };
}

export interface ContentScopeProviderProps {
    defaultValue: ContentScope;
    values: ContentScopeValues;
    children: (p: { match: match<NonNullRecord<ContentScope>> }) => ReactNode;
    location?: ContentScopeLocation;
}

export function ContentScopeProvider({ children, defaultValue, values, location = defaultContentScopeLocation }: ContentScopeProviderProps) {
    const path = location.createPath(values);
    const defaultUrl = location.createUrl(defaultValue);
    const match = useRouteMatch<NonNullRecord<ContentScope>>(path);
    const [redirectPathAfterChange, setRedirectPathAfterChange] = useState<string>();
    const currentLocation = useLocation();

    let defaultRedirectPathAfterChange: string | undefined;

    if (match) {
        // Location: /main/en/dashboard
        // Match: /main/en
        // Page: Location - Match = /dashboard
        defaultRedirectPathAfterChange = currentLocation.pathname.replace(match.url, "");
    }

    return (
        <Context.Provider
            value={{
                path,
                redirectPathAfterChange: redirectPathAfterChange ?? defaultRedirectPathAfterChange,
                setRedirectPathAfterChange,
                values,
                location: location as ContentScopeLocation,
            }}
        >
            <Switch>
                {match && (
                    <Route exact={false} strict={false} path={path}>
                        {children({ match })}
                    </Route>
                )}
                <Redirect to={defaultUrl} />
            </Switch>
        </Context.Provider>
    );
}
