import { type Editor, Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { type EditorView } from "@tiptap/pm/view";

import { getListDepth } from "./getListDepth";

function stripListNesting(html: string, maxLevels: number): string {
    if (typeof document === "undefined") {
        return html;
    }

    const container = document.createElement("div");
    container.innerHTML = html;

    function processElement(element: Element, listDepth: number): void {
        Array.from(element.children).forEach((child) => {
            const isListNode = child.tagName === "UL" || child.tagName === "OL";
            if (isListNode && listDepth >= maxLevels) {
                child.remove();
            } else {
                processElement(child, isListNode ? listDepth + 1 : listDepth);
            }
        });
    }

    processElement(container, 0);
    return container.innerHTML;
}

export const ListLevelMax = Extension.create<{ listLevelMax: number }>({
    name: "listLevelMax",

    addOptions() {
        return {
            listLevelMax: 4,
        };
    },

    addKeyboardShortcuts() {
        return {
            Tab: () => {
                const { listLevelMax } = this.options;
                if (getListDepth(this.editor as Editor) >= listLevelMax) {
                    return true; // Prevent default Tab behavior (sinkListItem)
                }
                return false; // Allow default handler (ListItem extension) to handle Tab
            },
        };
    },

    addProseMirrorPlugins() {
        const { listLevelMax } = this.options;
        return [
            new Plugin({
                key: new PluginKey("listLevelMaxPaste"),
                props: {
                    transformPastedHTML: (html: string, view: EditorView): string => {
                        const { $from } = view.state.selection;
                        let currentDepth = 0;
                        for (let d = $from.depth; d > 0; d--) {
                            const name = $from.node(d).type.name;
                            if (name === "bulletList" || name === "orderedList") {
                                currentDepth++;
                            }
                        }
                        const allowedAdditionalLevels = Math.max(0, listLevelMax - currentDepth);
                        return stripListNesting(html, allowedAdditionalLevels);
                    },
                },
            }),
        ];
    },
});
