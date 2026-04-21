import { Extension } from "@tiptap/core";

function getListDepth(editor: { state: { selection: { $from: { depth: number; node: (d: number) => { type: { name: string } } } } } }): number {
    const { $from } = editor.state.selection;
    let listDepth = 0;
    for (let d = $from.depth; d > 0; d--) {
        const nodeName = $from.node(d).type.name;
        if (nodeName === "bulletList" || nodeName === "orderedList") {
            listDepth++;
        }
    }
    return listDepth;
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
                if (getListDepth(this.editor) >= listLevelMax) {
                    return true; // Prevent default Tab behavior (sinkListItem)
                }
                return false; // Allow default handler (ListItem extension) to handle Tab
            },
        };
    },
});
