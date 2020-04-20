import * as React from "react";
import { IControlProps } from "../types";
import FeaturesButtonGroup from "./FeaturesButtonGroup";
import useBlockTypes from "./useBlockTypes";

export default function ListsControls({
    editorState,
    setEditorState,
    editorRef,
    options: { supports: supportedThings, customBlockMap: customBlockTypeMap },
}: IControlProps) {
    const { listsFeatures } = useBlockTypes({ editorState, setEditorState, supportedThings, customBlockTypeMap, editorRef });
    if (!listsFeatures) {
        return null;
    }
    return <FeaturesButtonGroup features={listsFeatures} />;
}
