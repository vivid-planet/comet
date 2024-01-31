import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";

export function htmlToState({
    translation,
    linkDataList,
}: {
    translation: string;
    linkDataList: {
        id: string;
        data: any;
    }[];
}) {
    const translatedContentState = stateFromHTML(translation, {
        customInlineFn: (element, { Style, Entity }) => {
            if (element.tagName === "SUB") {
                return Style("SUB");
            }
            if (element.tagName === "SUP") {
                return Style("SUP");
            }
            if (element.tagName == "SPAN") {
                return Style((element.attributes as any).customType.value);
            }
            if (element.tagName === "A") {
                return Entity("LINK", { id: (element.attributes as any).arrayRef.value });
            }
        },
    });

    const { entityMap, blocks } = convertToRaw(translatedContentState);

    for (const key of Object.keys(entityMap)) {
        if ("id" in entityMap[key].data) {
            entityMap[key].data = linkDataList.find((item) => item.id == entityMap[key].data.id)?.data;
        }
    }

    const translatedContentStateWithLinkData = convertFromRaw({ entityMap, blocks });

    return EditorState.createWithContent(translatedContentStateWithLinkData);
}
