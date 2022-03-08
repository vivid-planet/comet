import * as React from "react";

import { ISelectionApi } from "./SelectionApi";

interface IState {
    id?: string;
    mode?: "edit" | "add";
}
export function useSelection(): [{ id?: string; mode?: "edit" | "add" }, ISelectionApi] {
    const [selection, setSelection] = React.useState<IState>({ id: undefined, mode: undefined });

    const handleSelectId = React.useCallback(
        async (id: string) => {
            setSelection({ id, mode: "edit" });
        },
        [setSelection],
    );

    const handleDeselect = React.useCallback(async () => {
        setSelection({ id: undefined, mode: undefined });
    }, [setSelection]);

    const handleAdd = React.useCallback(
        (id?: string) => {
            setSelection({ id, mode: "add" });
        },
        [setSelection],
    );

    const api: ISelectionApi = React.useMemo(
        () => ({
            handleSelectId,
            handleDeselect,
            handleAdd,
        }),
        [handleSelectId, handleDeselect, handleAdd],
    );

    return [
        {
            id: selection.id,
            mode: selection.mode,
        },
        api,
    ];
}

export interface ISelectionRenderPropArgs {
    selectedId?: string;
    selectionMode?: "edit" | "add";
    selectionApi: ISelectionApi;
}

interface IProps {
    children: (injectedProps: ISelectionRenderPropArgs) => React.ReactNode;
}

export function Selection({ children }: IProps) {
    const [selection, api] = useSelection();
    return (
        <>
            {children({
                selectedId: selection.id,
                selectionMode: selection.mode,
                selectionApi: api,
            })}
        </>
    );
}
