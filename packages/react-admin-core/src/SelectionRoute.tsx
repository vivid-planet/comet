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

    const handleSelectId = React.useCallback(async (id: string) => {
        history.push(`${parentMatch.url}/${id}`);
    }, [history, parentMatch]);

    const handleDeselect = React.useCallback(async () => {
        history.push(`${parentMatch.url}`);
    }, [history, parentMatch]);

    const handleAdd = React.useCallback(() => {
        history.push(`${parentMatch.url}/add`);
    }, [history, parentMatch]);

    const api: ISelectionApi = React.useMemo(() => ({
        handleSelectId,
        handleDeselect,
        handleAdd,
    }), [handleSelectId, handleDeselect, handleAdd]);

    let selectedId: string | undefined;
    let selectionMode: "edit" | "add" | undefined;
    if (match && match.params.id === "add") {
        selectedId = undefined;
        selectionMode = "add";
    } else if (match) {
        selectedId = match.params.id;
        selectionMode = "edit";
    }

    return [ SelectionRouteInner, {
        id: selectedId,
        mode: selectionMode
    }, api];
}


export interface ISelectionRouterRenderPropArgs {
    selectedId?: string;
    selectionMode?: "edit" | "add";
    selectionApi: ISelectionApi;
}

interface IProps {
}
export const SelectionRouteInner: React.FunctionComponent<IProps> = ({ children }) => {
    const { path } = useRouteMatch();
    return <Route path={`${path}/:id`}>
        {() => <>{children}</>}
    </Route>;
}


interface ISelectionRouteHooklessProps extends IProps {
    children: (injectedProps: { selectedId?: string; selectionMode?: "edit" | "add", selectionApi: ISelectionApi }) => React.ReactNode;
}

export const SelectionRoute: React.FunctionComponent<ISelectionRouteHooklessProps> = ({ children }) => {
    const [ SelectionRouteConfigured, selection, api ] = useSelectionRoute();
    return <SelectionRouteConfigured>{children({ selectedId: selection.id, selectionMode: selection.mode, selectionApi: api })}</SelectionRouteConfigured>;
};
