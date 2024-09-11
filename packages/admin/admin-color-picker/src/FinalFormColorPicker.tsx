import { FieldRenderProps } from "react-final-form";

import { ColorPicker, ColorPickerProps } from "./ColorPicker";

export type FinalFormColorPickerProps = ColorPickerProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormColorPicker = ({ meta, input, ...restProps }: FinalFormColorPickerProps) => {
    return <ColorPicker {...input} {...restProps} />;
};
