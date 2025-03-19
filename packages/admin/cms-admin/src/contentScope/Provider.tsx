import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useMemo, useState } from "react";
import { match, Redirect, Route, Switch, useHistory, useRouteMatch } from "react-router";

import { defaultCreatePath } from "./utils/defaultCreatePath";

export interface ContentScopeInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

type ContentScopeLocation<S extends ContentScopeInterface = ContentScopeInterface> = {
    createPath: (scope: ContentScopeValues<S>) => string | string[];
    createUrl: (scope: S) => string;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SetContentScopeAction<S = any> = (state: S) => S;

export type UseContentScopeApi<S extends ContentScopeInterface = ContentScopeInterface> = {
    scope: S;
    setScope: (action: SetContentScopeAction<S>) => void;
    match: match;
    setRedirectPathAfterChange: Dispatch<SetStateAction<string | undefined>>;
    supported: boolean;
    values: ContentScopeValues<S>;
};

export type ContentScopeValues<S extends ContentScopeInterface = ContentScopeInterface> = Array<{
    [P in keyof S]: { label?: string; value: NonNull<S[P]> };
}>;

// @TODO (maybe): factory for Provider (and other components) to be able to create a generic context https://ordina-jworks.github.io/architecture/2021/02/12/react-generic-context.html
// ... and get rid of "as" type-assertions
const Context = createContext<ContentScopeContext>(defaultContentScopeContext);

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

function defaultCreateUrl(scope: ContentScopeInterface) {
    const formattedMatchParams = formatScopeToRouterMatchParams(scope);
    return Object.entries(formattedMatchParams).reduce((a, [, value]) => `${a}/${value}`, "");
}

// @TODO: scope can no longer be undefined
// @TODO: remove supported attribute
// @TODO: provide default empty scope "{}"
export function useContentScope<S extends ContentScopeInterface = ContentScopeInterface>(): UseContentScopeApi<S> {
    const context = useContext(Context);
    const history = useHistory();
    const matchContextScope = useRouteMatch<NonNullRecord<S>>(context?.path || "");
    const matchDefault = useRouteMatch();
    const match = matchContextScope || matchDefault;

    const matchParamsString = JSON.stringify(match.params); // convert matchParams to string, like this we can memoize or callbacks more easily
    const scope = useMemo(() => parseScopeFromRouterMatchParams<S>(JSON.parse(matchParamsString)), [matchParamsString]);
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
        values: context.values as ContentScopeValues<S>, // @TODO:
    };
}

export interface ContentScopeProviderProps<S extends ContentScopeInterface = ContentScopeInterface> {
    defaultValue: S;
    values: ContentScopeValues<S>;
    children: (p: { match: match<NonNullRecord<S>> }) => ReactNode;
    location?: ContentScopeLocation<S>;
}

export function ContentScopeProvider<S extends ContentScopeInterface = ContentScopeInterface>({
    children,
    defaultValue,
    values,
    location = defaultContentScopeLocation,
}: ContentScopeProviderProps<S>) {
    const path = location.createPath(values);
    const defaultUrl = location.createUrl(defaultValue);
    const match = useRouteMatch<NonNullRecord<S>>(path);
    const [redirectPathAfterChange, setRedirectPathAfterChange] = useState<undefined | string>("");

    return (
        <Context.Provider
            value={{
                path,
                redirectPathAfterChange,
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
