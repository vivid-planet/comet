import { EditorState } from "draft-js";
import * as React from "react";
import { IControlProps } from "../types";
import FeaturesButtonGroup from "./FeaturesButtonGroup";
import useInlineStyleType from "./useInlineStyleType";

export default function InlineStyleTypeControls({ editorState, setEditorState, options: { supports: supportedThings }, colors }: IControlProps) {
    const { features } = useInlineStyleType({ editorState, setEditorState, supportedThings });
    if (!features) {
        return null;
    }
    return <FeaturesButtonGroup features={features} colors={colors} />;
}
