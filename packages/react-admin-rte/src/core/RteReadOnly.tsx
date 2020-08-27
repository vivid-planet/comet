import "draft-js/dist/Draft.css"; // important for nesting of ul/ol

import { Editor as DraftJsEditor, EditorState } from "draft-js";
import * as React from "react";
import { styleMap } from "./Rte";
import { ICoreBlockTypeMap, ICustomBlockTypeMap } from "./types";
import createBlockRenderMap from "./utils/createBlockRenderMap";

export interface IRteReadOnlyOptions {
    customBlockMap?: ICustomBlockTypeMap;
    coreBlockMap?: ICoreBlockTypeMap;
}

export type IOptions = Partial<IRteReadOnlyOptions>;

export interface IProps {
    value: EditorState;
    plainTextOnly?: boolean;
    options?: IOptions;
}

const defaultOptions: IRteReadOnlyOptions = {};

const RteReadOnly: React.FC<IProps> = ({ value: editorState, options: passedOptions, plainTextOnly }) => {
    const editorRef = React.useRef<DraftJsEditor>(null);
    const options = passedOptions ? { ...defaultOptions, ...passedOptions } : defaultOptions; // merge default options with passed options
    const blockRenderMap = createBlockRenderMap({
        customBlockTypeMap: {
            ...(options.coreBlockMap ? options.coreBlockMap : {}),
            ...(options.customBlockMap ? options.customBlockMap : {}),
        },
    });
    function handleOnChange() {
        if (editorRef.current) {
            editorRef.current.blur();
        }
    }

    if (plainTextOnly) {
        return <>{editorState.getCurrentContent().getPlainText()}</>;
    }

    return (
        <>
            <DraftJsEditor
                ref={editorRef}
                editorState={editorState}
                onChange={handleOnChange}
                spellCheck={false}
                customStyleMap={styleMap}
                readOnly={true}
                blockRenderMap={blockRenderMap}
            />
        </>
    );
};

export default RteReadOnly;
