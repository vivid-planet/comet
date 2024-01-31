import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { v4 } from "uuid";

import { IRteOptions } from "../Rte";

export function stateToHtml({ editorState, options }: { editorState: EditorState; options: IRteOptions }) {
    const contentState = editorState.getCurrentContent();

    const customInlineStyleKeys = options?.customInlineStyles ? Object.keys(options.customInlineStyles) : [];

    const inlineStyles: any = {
        SUB: { element: "sub" },
        SUP: { element: "sup" },
    };

    customInlineStyleKeys.forEach((item) => {
        inlineStyles[item] = { element: "span", attributes: { customType: [item] } };
    });

    const linkDataList: { id: string; data: any }[] = [];

    const html = stateToHTML(contentState, {
        inlineStyles,
        entityStyleFn: (entity) => {
            const entityType = entity.getType();
            const data = entity.getData();

            if (entityType === "LINK") {
                const id = v4();
                linkDataList.push({ id, data });
                return { element: "a", attributes: { arrayRef: id } };
            }

            return undefined;
        },
    });

    return { html, linkDataList };
}
