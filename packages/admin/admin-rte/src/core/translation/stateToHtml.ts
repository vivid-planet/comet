import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import { IRteOptions } from "../Rte";

export function stateToHtml({ editorState, options }: { editorState: EditorState; options: IRteOptions }) {
    const contentState = editorState.getCurrentContent();

    const customInlineStyleKeys = options?.customInlineStyles ? Object.keys(options.customInlineStyles) : [];

    const inlineStyles: any = {
        SUB: { element: "sub" },
        SUP: { element: "sup" },
    };

    customInlineStyleKeys.forEach((item) => {
        inlineStyles[item] = { element: "span", attributes: { class: [item] } };
    });

    const entities: { id: string; data: any }[] = [];

    const html = stateToHTML(contentState, {
        inlineStyles,
        entityStyleFn: (entity) => {
            const entityType = entity.getType();
            const data = entity.getData();

            if (entityType === "LINK") {
                const id = `${entities.length}`;
                entities.push({ id, data });
                return { element: "a", attributes: { id } };
            }

            throw Error(`The entityType ${entityType} is not supported.`);
        },
    });

    return { html, entities };
}
