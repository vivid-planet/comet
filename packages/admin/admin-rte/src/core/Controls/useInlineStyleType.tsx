import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import * as detectBrowser from "detect-browser";
import { Editor, EditorState, RichUtils } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import TextFormatSub from "../../icons/TextFormatSub";
import TextFormatSup from "../../icons/TextFormatSup";
import { SupportedThings } from "../Rte";
import { CustomInlineStyles, IFeatureConfig, InlineStyleType } from "../types";

const browser = detectBrowser.detect();

interface IProps {
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
    supportedThings: SupportedThings[];
    editorRef: React.RefObject<Editor>;
    customInlineStyles?: CustomInlineStyles;
}

const defaultFeatures: Array<IFeatureConfig<InlineStyleType>> = [
    {
        name: "BOLD",
        label: <FormattedMessage id="comet.rte.controls.blockType.bold.label" defaultMessage="Bold" />,
        icon: FormatBoldIcon,
        tooltipText:
            browser?.os === "Mac OS" ? (
                <FormattedMessage id="comet.rte.controls.blockType.bold.tooltipMac" defaultMessage="Cmd+B" />
            ) : (
                <FormattedMessage id="comet.rte.controls.blockType.bold.tooltip" defaultMessage="Ctrl+B" />
            ),
    },
    {
        name: "ITALIC",
        label: <FormattedMessage id="comet.rte.controls.blockType.italic.label" defaultMessage="Italic" />,
        icon: FormatItalicIcon,
        tooltipText:
            browser?.os === "Mac OS" ? (
                <FormattedMessage id="comet.rte.controls.blockType.italic.tooltipMac" defaultMessage="Cmd+I" />
            ) : (
                <FormattedMessage id="comet.rte.controls.blockType.italic.tooltip" defaultMessage="Ctrl+I" />
            ),
    },
    {
        name: "UNDERLINE",
        label: <FormattedMessage id="comet.rte.controls.blockType.underlined.label" defaultMessage="underlined" />,
        icon: FormatUnderlinedIcon,
        tooltipText:
            browser?.os === "Mac OS" ? (
                <FormattedMessage id="comet.rte.controls.blockType.underlined.tooltipMac" defaultMessage="Cmd+U" />
            ) : (
                <FormattedMessage id="comet.rte.controls.blockType.underlined.tooltip" defaultMessage="Ctrl+U" />
            ),
    },
    {
        name: "STRIKETHROUGH",
        label: <FormattedMessage id="comet.rte.controls.blockType.strikethrough.label" defaultMessage="Strikethrough" />,
        icon: StrikethroughSIcon,
    },
    {
        name: "SUP",
        label: <FormattedMessage id="comet.rte.controls.blockType.super.label" defaultMessage="Superscript" />,
        icon: TextFormatSup,
    },
    {
        name: "SUB",
        label: <FormattedMessage id="comet.rte.controls.blockType.sub.label" defaultMessage="Subscript" />,
        icon: TextFormatSub,
    },
];

export default function useInlineStyleType({ editorState, setEditorState, supportedThings, editorRef, customInlineStyles }: IProps) {
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
                case "STRIKETHROUGH":
                    return supportedThings.includes("strikethrough");
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
        () => [
            ...defaultFeatures
                .filter((c) => supports(c.name))
                .map((c) => ({
                    ...c,
                    selected: inlineStyleActive(c.name),
                    onButtonClick: handleInlineStyleButtonClick.bind(null, c.name),
                })),
            ...(customInlineStyles
                ? Object.entries(customInlineStyles).map(([name, { label, icon }]) => ({
                      name,
                      label,
                      icon,
                      selected: inlineStyleActive(name),
                      onButtonClick: handleInlineStyleButtonClick.bind(null, name),
                  }))
                : []),
        ],
        [supports, inlineStyleActive, handleInlineStyleButtonClick, customInlineStyles],
    );

    return {
        features,
    };
}
