import { Extension } from "@tiptap/core";
import { Fragment, type Node as ProseMirrorNode, Slice } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";

function getListDepth(pos: number, doc: ProseMirrorNode): number {
    let depth = 0;
    const resolvedPos = doc.resolve(pos);
    for (let i = resolvedPos.depth; i > 0; i--) {
        const parentNode = resolvedPos.node(i);
        if (parentNode.type.name === "bulletList" || parentNode.type.name === "orderedList") {
            depth++;
        }
    }
    return depth;
}

function clipFragmentNesting(fragment: Fragment, maxDepth: number, currentDepth: number): Fragment {
    const nodes: ProseMirrorNode[] = [];
    fragment.forEach((node) => {
        if (node.type.name === "bulletList" || node.type.name === "orderedList") {
            if (currentDepth < maxDepth) {
                const clippedContent = clipFragmentNesting(node.content, maxDepth, currentDepth + 1);
                nodes.push(node.copy(clippedContent));
            }
            // If currentDepth >= maxDepth, drop the entire nested list
        } else if (node.type.name === "listItem") {
            const clippedContent = clipFragmentNesting(node.content, maxDepth, currentDepth);
            nodes.push(node.copy(clippedContent));
        } else {
            if (node.content.size > 0) {
                const clippedContent = clipFragmentNesting(node.content, maxDepth, currentDepth);
                nodes.push(node.copy(clippedContent));
            } else {
                nodes.push(node);
            }
        }
    });
    return Fragment.from(nodes);
}

function clipListNesting(slice: Slice, maxDepth: number): Slice {
    const fragment = clipFragmentNesting(slice.content, maxDepth, 0);
    return new Slice(fragment, slice.openStart, slice.openEnd);
}

export interface ListLevelMaxOptions {
    listLevelMax: number;
}

export const ListLevelMax = Extension.create<ListLevelMaxOptions>({
    name: "listLevelMax",

    addOptions() {
        return {
            listLevelMax: 4,
        };
    },

    addKeyboardShortcuts() {
        return {
            Tab: () => {
                const { state } = this.editor;
                const { selection } = state;
                const depth = getListDepth(selection.from, state.doc);

                // depth is the current list nesting level
                // sinkListItem moves the item one level deeper, so block if already at max
                if (depth >= this.options.listLevelMax) {
                    return true; // Consume the event but don't do anything
                }

                return this.editor.commands.sinkListItem("listItem");
            },
        };
    },

    addProseMirrorPlugins() {
        const listLevelMax = this.options.listLevelMax;

        return [
            new Plugin({
                key: new PluginKey("listLevelMax"),
                props: {
                    transformPasted(slice) {
                        return clipListNesting(slice, listLevelMax);
                    },
                },
            }),
        ];
    },
});
