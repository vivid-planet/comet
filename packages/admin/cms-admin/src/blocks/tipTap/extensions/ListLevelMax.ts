import { type Editor, Extension } from "@tiptap/core";

import { getListDepth } from "./getListDepth";

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
});
