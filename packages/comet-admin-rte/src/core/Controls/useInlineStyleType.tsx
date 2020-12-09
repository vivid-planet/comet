import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import StrikethroughSIcon from "@material-ui/icons/StrikethroughS";
import { SupportedThings } from "@vivid-planet/comet-admin-rte/src/core/Rte";
import { IFeatureConfig, InlineStyleType } from "@vivid-planet/comet-admin-rte/src/core/types";
import TextFormatSub from "@vivid-planet/comet-admin-rte/src/icons/TextFormatSub";
import TextFormatSup from "@vivid-planet/comet-admin-rte/src/icons/TextFormatSup";
import { EditorState, RichUtils } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface IProps {
    editorState: EditorState;
    setEditorState: (es: EditorState) => void;
    supportedThings: SupportedThings[];
}

const defaultFeatures: Array<IFeatureConfig<InlineStyleType>> = [
    {
        name: "BOLD",
        label: <FormattedMessage id="cometAdmin.rte.controls.blockType.bold.label" defaultMessage="bold" />,
        Icon: FormatBoldIcon,
        tooltipText: <FormattedMessage id="cometAdmin.rte.controls.blockType.bold.tooltip" defaultMessage="Ctrl+B" />,
    },
    {
        name: "ITALIC",
        label: <FormattedMessage id="cometAdmin.rte.controls.blockType.italic.label" defaultMessage="italic" />,
        Icon: FormatItalicIcon,
        tooltipText: <FormattedMessage id="cometAdmin.rte.controls.blockType.italic.tooltip" defaultMessage="Ctrl+I" />,
    },
    {
        name: "UNDERLINE",
        label: <FormattedMessage id="cometAdmin.rte.controls.blockType.underlined.label" defaultMessage="underlined" />,
        Icon: FormatUnderlinedIcon,
        tooltipText: <FormattedMessage id="cometAdmin.rte.controls.blockType.underlined.tooltip" defaultMessage="Ctrl+U" />,
    },
    {
        name: "STRIKETHROUGH",
        label: <FormattedMessage id="cometAdmin.rte.controls.blockType.strikethrough.label" defaultMessage="strikethrough" />,
        Icon: StrikethroughSIcon,
    },
    {
        name: "SUP",
        label: <FormattedMessage id="cometAdmin.rte.controls.blockType.super.label" defaultMessage="super" />,
        Icon: TextFormatSup,
    },
    {
        name: "SUB",
        label: <FormattedMessage id="cometAdmin.rte.controls.blockType.sub.label" defaultMessage="sub" />,
        Icon: TextFormatSub,
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
        () =>
            defaultFeatures
                .filter((c) => supports(c.name))
                .map((c) => ({
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
