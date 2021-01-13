import * as React from "react";

import { IControlProps } from "../types";
import FeaturesButtonGroup from "./FeaturesButtonGroup";
import useBlockTypes from "./useBlockTypes";

export default function ListsControls({
    editorState,
    setEditorState,
    editorRef,
    options: { supports: supportedThings, blocktypeMap },
}: IControlProps) {
    const { listsFeatures } = useBlockTypes({ editorState, setEditorState, supportedThings, blocktypeMap, editorRef });
    if (listsFeatures.length < 1) {
        return null;
    }
    return <FeaturesButtonGroup features={listsFeatures} />;
}
