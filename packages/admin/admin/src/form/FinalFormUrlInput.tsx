import { InputBase, type InputBaseProps } from "@mui/material";
import { type FocusEvent } from "react";
import { type FieldRenderProps } from "react-final-form";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { type AllowedProtocols, ensureUrlHasProtocol } from "./helpers/urlProtocol";

export type FinalFormUrlInputProps = InputBaseProps & {
    clearable?: boolean;
    /**
     * Configuration for allowed protocols in URL fields.
     * - string[]: Custom list of allowed protocol names (e.g., ["https", "http", "mailto"])
     * - "web-only": Only allows https and http protocols
     * - "all": Allows all protocols except dangerous ones (javascript, data, vbscript)
     * - undefined: Same as "all" (default behavior)
     */
    allowedProtocols?: AllowedProtocols;
};

type FinalFormUrlInputInternalProps = FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible UrlInput component.
 *
 * @see {@link UrlField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export function FinalFormUrlInput({
    meta,
    input,
    innerRef,
    endAdornment,
    clearable,
    allowedProtocols,
    ...props
}: FinalFormUrlInputProps & FinalFormUrlInputInternalProps) {
    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        const formattedValue = ensureUrlHasProtocol(event.target.value);

        if (formattedValue !== event.target.value) {
            input.onChange(formattedValue);
        }

        input.onBlur(event);
    };

    return (
        <InputBase
            {...input}
            {...props}
            onBlur={handleBlur}
            type="url"
            endAdornment={
                (endAdornment || clearable) && (
                    <>
                        {clearable && (
                            <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => input.onChange("")} />
                        )}
                        {endAdornment}
                    </>
                )
            }
        />
    );
}
