import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";

export function htmlToState({
    html,
    entities,
}: {
    html: string;
    entities: {
        id: string;
        data: any;
    }[];
}) {
    const translatedContentState = stateFromHTML(html, {
        customInlineFn: (element, { Style, Entity }) => {
            if (element.tagName === "SUB") {
                return Style("SUB");
            }
            if (element.tagName === "SUP") {
                return Style("SUP");
            }
            if (element.tagName == "SPAN") {
                return Style((element.attributes as any).class.value);
            }
            if (element.tagName === "A") {
                return Entity("LINK", { id: (element.attributes as any).id.value });
            }
        },
    });

    const { entityMap, blocks } = convertToRaw(translatedContentState);

    for (const key of Object.keys(entityMap)) {
        if ("id" in entityMap[key].data) {
            entityMap[key].data = entities.find((item) => item.id == entityMap[key].data.id)?.data;
        }
    }

    const translatedContentStateWithLinkData = convertFromRaw({ entityMap, blocks });

    return EditorState.createWithContent(translatedContentStateWithLinkData);
}
