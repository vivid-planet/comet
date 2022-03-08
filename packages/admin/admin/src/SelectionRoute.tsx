import * as React from "react";
import { Route, useHistory, useRouteMatch } from "react-router";

import { ISelectionApi } from "./SelectionApi";

interface IRouteParams {
    id?: string;
}

export function useSelectionRoute(): [React.ComponentType<IProps>, { id?: string; mode?: "edit" | "add" }, ISelectionApi] {
    const history = useHistory();
    const parentMatch = useRouteMatch();
    const match = useRouteMatch<IRouteParams>(`${parentMatch.path}/:id`);

    const parentUrl = parentMatch.url;

    const handleSelectId = React.useCallback(
        async (id: string) => {
            history.push(`${parentUrl}/${id}`);
        },
        [history, parentUrl],
    );

    const handleDeselect = React.useCallback(async () => {
        history.push(`${parentUrl}`);
    }, [history, parentUrl]);

    const handleAdd = React.useCallback(
        (id?: string) => {
            history.push(`${parentUrl}/add${id ? `-${id}` : ""}`);
        },
        [history, parentUrl],
    );

    const api: ISelectionApi = React.useMemo(
        () => ({
            handleSelectId,
            handleDeselect,
            handleAdd,
        }),
        [handleSelectId, handleDeselect, handleAdd],
    );

    const routeId: string | null = match && match.params.id ? match.params.id : null;
    const selection = React.useMemo(() => {
        let selectedId: string | undefined;
        let selectionMode: "edit" | "add" | undefined;
        if (routeId && (routeId === "add" || routeId.startsWith("add-"))) {
            selectedId = routeId.startsWith("add-") ? routeId.substr(4) : undefined;
            selectionMode = "add";
        } else if (routeId) {
            selectedId = routeId;
            selectionMode = "edit";
        }

        return {
            id: selectedId,
            mode: selectionMode,
        };
    }, [routeId]);

    return [SelectionRouteInner, selection, api];
}

export interface ISelectionRouterRenderPropArgs {
    selectedId?: string;
    selectionMode?: "edit" | "add";
    selectionApi: ISelectionApi;
}

interface IProps {}
export const SelectionRouteInner: React.FunctionComponent<IProps> = ({ children }) => {
    const { path } = useRouteMatch();
    return <Route path={`${path}/:id`}>{() => <>{children}</>}</Route>;
};

interface ISelectionRouteHooklessProps extends IProps {
    children: (injectedProps: { selectedId?: string; selectionMode?: "edit" | "add"; selectionApi: ISelectionApi }) => React.ReactNode;
}

export const SelectionRoute: React.FunctionComponent<ISelectionRouteHooklessProps> = ({ children }) => {
    const [SelectionRouteConfigured, selection, api] = useSelectionRoute();
    return (
        <SelectionRouteConfigured>
            {children({ selectedId: selection.id, selectionMode: selection.mode, selectionApi: api })}
        </SelectionRouteConfigured>
    );
};
