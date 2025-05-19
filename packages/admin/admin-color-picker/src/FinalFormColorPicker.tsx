import { type FieldRenderProps } from "react-final-form";

import { ColorPicker, type ColorPickerProps } from "./ColorPicker";

export type FinalFormColorPickerProps = ColorPickerProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible ColorPicker component.
 *
 * @see {@link ColorField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormColorPicker = ({ meta, input, ...restProps }: FinalFormColorPickerProps) => {
    return <ColorPicker {...input} {...restProps} />;
};
