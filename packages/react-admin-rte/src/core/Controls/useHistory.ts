import RedoIcon from "@material-ui/icons/Redo";
import UndoIcon from "@material-ui/icons/Undo";
import { EditorState } from "draft-js";
import * as React from "react";
import { SupportedThings } from "../Rte";
import { IFeatureConfig } from "../types";

interface IProps {
    editorState: EditorState;
    setEditorState: (es: EditorState) => void;
    supportedThings: SupportedThings[];
}

export default function useHistory({ editorState, setEditorState, supportedThings }: IProps) {
    // can check if history is supported
    const supported = React.useMemo(() => supportedThings.includes("history"), [supportedThings]);
    const canRedo = React.useMemo(() => !editorState.getRedoStack().isEmpty(), [editorState]);
    const canUndo = React.useMemo(() => !editorState.getUndoStack().isEmpty(), [editorState]);

    const handleUndoClick = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            const newEditorState = EditorState.undo(editorState);
            setEditorState(newEditorState);
        },
        [editorState, setEditorState],
    );

    const handleRedoClick = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            const newEditorState = EditorState.redo(editorState);
            setEditorState(newEditorState);
        },
        [editorState, setEditorState],
    );

    const features: IFeatureConfig[] = React.useMemo(
        () =>
            supported
                ? [
                      {
                          name: "undo",
                          label: "Undo",
                          disabled: !canUndo,
                          onButtonClick: handleUndoClick,
                          Icon: UndoIcon,
                          tooltipText: "Ctrl+Z",
                      },
                      {
                          name: "redo",
                          label: "Redo",
                          disabled: !canRedo,
                          onButtonClick: handleRedoClick,
                          Icon: RedoIcon,
                          tooltipText: "Ctrl+Y",
                      },
                  ]
                : [],
        [supported, canRedo, canUndo, handleUndoClick, handleRedoClick],
    );

    return {
        features,
    };
}
