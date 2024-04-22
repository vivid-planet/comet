import * as React from "react";
import { generatePath, match, Redirect, Route, Switch, useHistory, useRouteMatch } from "react-router";

export interface ContentScopeInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface ContentScopeContext {
    path: string;
    redirectPathAfterChange?: string; // define where the user should be redirected to after a scope change
    setRedirectPathAfterChange: React.Dispatch<React.SetStateAction<string | undefined>>;
    values: Array<ContentScopeInterface>;
}

const defaultContentScopeContext: ContentScopeContext = {
    path: "/",
    setRedirectPathAfterChange: () => {
        //
    },
    values: [],
};

type NonNull<T> = T extends null ? never : T;
type NonNullRecord<T> = {
    [P in keyof T]: NonNull<T[P]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SetContentScopeAction<S = any> = (state: S) => S;

export type UseContentScopeApi<S extends ContentScopeInterface = ContentScopeInterface> = {
    scope: S;
    setScope: (action: SetContentScopeAction<S>) => void;
    match: match;
    setRedirectPathAfterChange: React.Dispatch<React.SetStateAction<string | undefined>>;
    supported: boolean;
    values: Array<ContentScopeInterface>;
};

export type ContentScopeValues<S extends ContentScopeInterface = ContentScopeInterface> = {
    [P in keyof S]: Array<{ label?: string; value: NonNull<S[P]> }>;
};

// @TODO (maybe): factory for Provider (and other components) to be able to create a generic context https://ordina-jworks.github.io/architecture/2021/02/12/react-generic-context.html
// ... and get rid of "as" type-assertions
const Context = React.createContext<ContentScopeContext>(defaultContentScopeContext);

const NullValueAsString = "-"; // used to represent null-values in the url

function parseScopeFromRouterMatchParams<S extends ContentScopeInterface = ContentScopeInterface>(params: NonNullRecord<S>): S {
    return Object.entries(params).reduce((a, [key, value]) => {
        return {
            ...a,
            [key]: !value || value === NullValueAsString ? null : value,
        };
    }, {} as S);
}

function formatScopeToRouterMatchParams<S extends ContentScopeInterface = ContentScopeInterface>(scope: Partial<S>): NonNullRecord<S> {
    return Object.entries(scope).reduce((a, [key, value]) => {
        return {
            ...a,
            [key]: !value || value === null ? NullValueAsString : value,
        };
    }, {} as NonNullRecord<S>);
}

function defaultCreatePath(values: Array<ContentScopeInterface>) {
    const scopeKeys: { [key: string]: Set<string> } = {};
    values.forEach((value) => {
        Object.keys(value).forEach((key) => {
            if (!scopeKeys[key]) scopeKeys[key] = new Set();
            scopeKeys[key].add(value[key].value);
        });
    });
    const path = Object.keys(scopeKeys).reduce((a, key) => {
        const plainValues = Array.from(scopeKeys[key]);
        const whiteListedValuesString = plainValues ? `(${plainValues.join("|")})` : "";
        return `${a}/:${key}${whiteListedValuesString}`;
    }, "");
    return path;
}

function defaultCreateUrl(scope: ContentScopeInterface) {
    const formattedMatchParams = formatScopeToRouterMatchParams(scope);
    return Object.entries(formattedMatchParams).reduce((a, [, value]) => `${a}/${value}`, "");
}

// @TODO: scope can no longer be undefined
// @TODO: remove supported attribute
// @TODO: provide default empty scope "{}"
export function useContentScope<S extends ContentScopeInterface = ContentScopeInterface>(): UseContentScopeApi<S> {
    const context = React.useContext(Context);
    const history = useHistory();
    const matchContextScope = useRouteMatch<NonNullRecord<S>>(context?.path || "");
    const matchDefault = useRouteMatch();
    const match = matchContextScope || matchDefault;

    const matchParamsString = JSON.stringify(match.params); // convert matchParams to string, like this we can memoize or callbacks more easily
    const scope = React.useMemo(() => parseScopeFromRouterMatchParams<S>(JSON.parse(matchParamsString)), [matchParamsString]);
    const matchPath = match.path;
    const redirectPath = context.redirectPathAfterChange;
    const setScope = React.useCallback(
        (action: SetContentScopeAction) => {
            const newContentScope = action(scope);
            const pathAfterScopePath = redirectPath || "";
            const url = generatePath(matchPath, formatScopeToRouterMatchParams(newContentScope));
            history.push({ pathname: url + pathAfterScopePath });
        },
        [scope, matchPath, history, redirectPath],
    );

    return {
        scope,
        setScope,
        match,
        setRedirectPathAfterChange: context.setRedirectPathAfterChange,
        supported: Object.keys(scope).length > 0,
        values: context.values,
    };
}

export interface ContentScopeProviderProps<S extends ContentScopeInterface = ContentScopeInterface> {
    defaultValue: S;
    values: Array<ContentScopeInterface>;
    children: (p: { match: match<NonNullRecord<S>> }) => React.ReactNode;
    location?: {
        createPath: (scope: Array<ContentScopeInterface>) => string;
        createUrl: (scope: S) => string;
    };
}

export function ContentScopeProvider<S extends ContentScopeInterface = ContentScopeInterface>({
    children,
    defaultValue,
    values,
    location = { createPath: defaultCreatePath, createUrl: defaultCreateUrl },
}: ContentScopeProviderProps<S>): React.ReactElement {
    const path = location.createPath(values);
    const defaultUrl = location.createUrl(defaultValue);
    const match = useRouteMatch<NonNullRecord<S>>(path);
    const [redirectPathAfterChange, setRedirectPathAfterChange] = React.useState<undefined | string>("");

    return (
        <Context.Provider value={{ path, redirectPathAfterChange, setRedirectPathAfterChange, values }}>
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
