import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import { EditorState } from "draft-js";
import * as React from "react";
import { useIntl } from "react-intl";

import { SupportedThings } from "../Rte";
import { IFeatureConfig } from "../types";

interface IProps {
    editorState: EditorState;
    setEditorState: (es: EditorState) => void;
    supportedThings: SupportedThings[];
}

export default function useHistory({ editorState, setEditorState, supportedThings }: IProps) {
    const intl = useIntl();

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
                          label: intl.formatMessage({ id: "cometAdmin.rte.controls.undo.label", defaultMessage: "Undo" }),
                          disabled: !canUndo,
                          onButtonClick: handleUndoClick,
                          icon: UndoIcon,
                          tooltipText: intl.formatMessage({ id: "cometAdmin.rte.controls.undo.tooltip", defaultMessage: "Ctrl+Z" }),
                      },
                      {
                          name: "redo",
                          label: intl.formatMessage({ id: "cometAdmin.rte.controls.redo.label", defaultMessage: "Redo" }),
                          disabled: !canRedo,
                          onButtonClick: handleRedoClick,
                          icon: RedoIcon,
                          tooltipText: intl.formatMessage({ id: "cometAdmin.rte.controls.redo.tooltip", defaultMessage: "Ctrl+Y" }),
                      },
                  ]
                : [],
        [supported, canRedo, canUndo, handleUndoClick, handleRedoClick, intl],
    );

    return {
        features,
    };
}
