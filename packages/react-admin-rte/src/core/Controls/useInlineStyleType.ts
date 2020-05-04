import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import { EditorState, RichUtils } from "draft-js";
import * as React from "react";
import { SuportedThings } from "../Rte";
import { IFeatureConfig, InlineStyleType } from "../types";

interface IProps {
    editorState: EditorState;
    setEditorState: (es: EditorState) => void;
    supportedThings: SuportedThings[];
}

const defaultFeatures: Array<IFeatureConfig<InlineStyleType>> = [
    {
        name: "BOLD",
        label: "fett",
        Icon: FormatBoldIcon,
        tooltipText: "Ctrl+B",
    },
    {
        name: "ITALIC",
        label: "italic",
        Icon: FormatItalicIcon,
        tooltipText: "Ctrl+I",
    },
    {
        name: "UNDERLINE",
        label: "unterstrichen",
        Icon: FormatUnderlinedIcon,
        tooltipText: "Ctrl+U",
    },
    {
        name: "SUP",
        label: "super",
        Icon: ArrowDropUpIcon, // @TODO, better icon
    },
    {
        name: "SUB",
        label: "sub",
        Icon: ArrowDropDownIcon, // @TODO, better icon
    },
];

export default function useInlineStyleType({ editorState, setEditorState, supportedThings }: IProps) {
    // can check if inlineStyleType is supported by the editor
    const supports = React.useCallback(
        (inlineStyle: InlineStyleType) => {
            switch (inlineStyle) {
                case "BOLD":
                    return supportedThings.includes("bold");
                case "ITALIC":
                    return supportedThings.includes("italic");
                case "UNDERLINE":
                    return supportedThings.includes("underline");
                case "SUB":
                    return supportedThings.includes("sub");
                case "SUP":
                    return supportedThings.includes("sup");
                default:
                    return false;
            }
        },
        [supportedThings],
    );

    const inlineStyleActive = React.useCallback(
        (draftInlineStyleType: InlineStyleType) => {
            const currentStyle = editorState.getCurrentInlineStyle();
            return currentStyle.has(draftInlineStyleType);
        },
        [editorState],
    );

    const handleInlineStyleButtonClick = React.useCallback(
        (draftInlineStyleType: InlineStyleType, e: React.MouseEvent) => {
            e.preventDefault();
            setEditorState(RichUtils.toggleInlineStyle(editorState, draftInlineStyleType));
        },
        [setEditorState, editorState],
    );

    const features: Array<IFeatureConfig<InlineStyleType>> = React.useMemo(
        () =>
            defaultFeatures
                .filter(c => supports(c.name))
                .map(c => ({
                    ...c,
                    selected: inlineStyleActive(c.name),
                    onButtonClick: handleInlineStyleButtonClick.bind(null, c.name),
                })),
        [supports, inlineStyleActive, handleInlineStyleButtonClick],
    );

    return {
        features,
    };
}
