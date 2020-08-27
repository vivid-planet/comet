import { EditorState } from "draft-js";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import makeRteApi, { IMakeRteApiProps, OnDebouncedContentChangeFn } from "../core/makeRteApi";
import Rte, { IOptions as RteOptions, IProps as RteProps } from "../core/Rte";
import RteReadOnlyBase from "../core/RteReadOnly";

interface IConfig<T = any> {
    rteApiOptions?: IMakeRteApiProps<T>;
    rteOptions?: RteOptions;
}

const defaultConfig: IConfig = {};

function createRteField<T = any>(config: IConfig<T> = defaultConfig) {
    const { rteApiOptions, rteOptions } = config;
    const [useRteApi, { createStateFromRawContent }] = makeRteApi(rteApiOptions);

    const RteField: React.FunctionComponent<FieldRenderProps<T, HTMLInputElement> & Pick<RteProps, "options">> = ({
        input: { value, onChange, ...restInput },
        meta,
        value: remove,
        ...rest
    }) => {
        const ref = React.useRef<any>();

        const onDebouncedContentChange: OnDebouncedContentChangeFn<T> = (debouncedEditorState: EditorState, convertStateToRawContent) => {
            onChange(convertStateToRawContent(debouncedEditorState));
        };

        const { editorState, setEditorState } = useRteApi({
            defaultValue: value,
            onDebouncedContentChange,
        });

        return (
            <Rte
                ref={ref}
                value={editorState}
                onChange={c => {
                    setEditorState(c);
                }}
                options={rteOptions}
                {...rest}
                {...restInput}
            />
        );
    };

    const RteReadOnly: React.FunctionComponent<{ content?: T; plainTextOnly?: boolean }> = ({ content, plainTextOnly }) => {
        if (!content) {
            return null;
        }
        return (
            <RteReadOnlyBase
                value={createStateFromRawContent(content)}
                plainTextOnly={plainTextOnly}
                options={{
                    customBlockMap: rteOptions ? rteOptions.customBlockMap : undefined,
                    coreBlockMap: rteOptions ? rteOptions.coreBlockMap : undefined,
                }}
            />
        );
    };

    return { RteField, RteReadOnly };
}

export default createRteField;
