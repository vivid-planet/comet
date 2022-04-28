import { ColorPicker, ColorPickerProps } from "@comet/admin-color-picker";
import { makeStyles } from "@mui/styles";
import { DraftInlineStyle, EditorState, Modifier, RichUtils } from "draft-js";
import * as Immutable from "immutable";
import * as React from "react";

import { IControlProps, ToolbarButtonComponent } from "../types";

type CreateColorPickerToolbarButtonOptions = Pick<ColorPickerProps, "colorFormat" | "colorPalette" | "hidePicker" | "invalidIndicatorCharacter">;

const COLOR_STYLE_PREFIX = "COLOR_";

function isColorStyle(style: string): boolean {
    return style.startsWith(COLOR_STYLE_PREFIX);
}

function styleFromColor(color: string): string {
    return `${COLOR_STYLE_PREFIX}${color}`;
}

function colorFromStyle(style: string): string {
    return style.replace(COLOR_STYLE_PREFIX, "");
}

// Inspired by https://github.com/facebook/draft-js/blob/main/examples/draft-0-10-0/color/color.html
function createColorPickerToolbarButton(options: CreateColorPickerToolbarButtonOptions = {}): ToolbarButtonComponent {
    function ColorPickerToolbarButton({ editorState, setEditorState, editorRef }: IControlProps) {
        if (editorRef.current !== null) {
            if (editorRef.current.props.customStyleFn === undefined && process.env.NODE_ENV === "development") {
                // eslint-disable-next-line no-console
                console.warn(
                    "No custom style function is set for the editor. Colors will be applied, but not displayed. Make sure to add 'colorStyleFn' in 'options':\n" +
                        "\n" +
                        "<Rte\n" +
                        "  options={{\n" +
                        "    draftJsProps: {\n" +
                        "      customStyleFn: colorStyleFn\n" +
                        "    }\n" +
                        "  }}\n" +
                        "/>\n" +
                        "\n",
                );
            }
        }

        const [currentColor, setCurrentColor] = React.useState<string | undefined>();

        React.useEffect(() => {
            // Only update color when selection changes and the editor is in focus. Prevents an issue where the current color changes to undefined
            // when the selection is collapsed (= cursor only) and the editor loses focus.
            if (editorState.getSelection().getHasFocus()) {
                const currentStyle = getCurrentInlineStyles(editorState);

                const colorStyles = currentStyle.filter((value) => value !== undefined && isColorStyle(value));

                if (colorStyles.size === 1) {
                    setCurrentColor(colorFromStyle(colorStyles.first()));
                } else if (colorStyles.size > 1) {
                    setCurrentColor("Mixed");
                } else {
                    setCurrentColor(undefined);
                }
            }
        }, [editorState]);

        const classes = useStyles();

        const handleChange = (color: string | null) => {
            const selection = editorState.getSelection();
            const currentStyle = getCurrentInlineStyles(editorState);

            // Remove all other colors from current selection
            let nextContentState = editorState.getCurrentContent();

            currentStyle.forEach((style) => {
                if (style !== undefined && isColorStyle(style)) {
                    nextContentState = Modifier.removeInlineStyle(nextContentState, selection, style);
                }
            });

            let nextEditorState = EditorState.push(editorState, nextContentState, "change-inline-style");

            // Force selection to allow typing while selecting a new color
            nextEditorState = EditorState.forceSelection(nextEditorState, selection);

            // Remove current set color from cursor
            if (selection.isCollapsed()) {
                currentStyle.forEach((style) => {
                    if (style !== undefined && isColorStyle(style)) {
                        nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
                    }
                });
            }

            if (color !== null) {
                const style = styleFromColor(color);

                if (!currentStyle.has(style)) {
                    nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
                }
            }

            setEditorState(nextEditorState);
        };

        return <ColorPicker {...options} value={currentColor} onChange={handleChange} classes={classes} variant="icon-only" />;
    }

    return ColorPickerToolbarButton;
}

const useStyles = makeStyles({
    preview: {
        width: 18,
        height: 18,
    },
});

function colorStyleFn(style: DraftInlineStyle): React.CSSProperties {
    const colorStyle = style.filter((style) => style !== undefined && isColorStyle(style)).first();

    if (colorStyle !== undefined) {
        return {
            color: colorFromStyle(colorStyle),
        };
    }

    return {};
}

// Adapted from from https://github.com/facebook/draft-js/issues/2177#issuecomment-989752378
function getCurrentInlineStyles(editorState: EditorState): Immutable.Set<string> {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    if (selection.isCollapsed()) {
        return editorState.getCurrentInlineStyle().toSet();
    } else {
        let styles = Immutable.Set<string>();

        let currentKey = selection.getStartKey();
        let startOffset = selection.getStartOffset();
        const endKey = selection.getEndKey();
        const endOffset = selection.getEndOffset();

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const lastRound = currentKey == endKey;
            const block = contentState.getBlockForKey(currentKey);
            const offsetEnd = lastRound ? endOffset : block.getLength();
            const characterList = block.getCharacterList();

            for (let offsetIndex = startOffset; offsetIndex < offsetEnd; offsetIndex++) {
                characterList
                    .get(offsetIndex)
                    .getStyle()
                    .forEach((style) => {
                        if (style) {
                            styles = styles.add(style);
                        }
                    });
            }

            if (lastRound) {
                break;
            }

            currentKey = contentState.getKeyAfter(currentKey);
            startOffset = 0;
        }

        return styles;
    }
}

export { colorStyleFn, createColorPickerToolbarButton };
