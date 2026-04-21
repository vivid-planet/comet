import { type Editor } from "@tiptap/core";

export function getListDepth(editor: Editor): number {
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
