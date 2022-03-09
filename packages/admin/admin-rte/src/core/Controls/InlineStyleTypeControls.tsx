import * as React from "react";

import { IControlProps } from "../types";
import FeaturesButtonGroup from "./FeaturesButtonGroup";
import useInlineStyleType from "./useInlineStyleType";

export default function InlineStyleTypeControls({
    editorState,
    setEditorState,
    options: { supports: supportedThings },
    disabled,
}: IControlProps): React.ReactElement | null {
    const { features } = useInlineStyleType({ editorState, setEditorState, supportedThings });
    if (!features) {
        return null;
    }
    return <FeaturesButtonGroup features={features} disabled={disabled} />;
}
