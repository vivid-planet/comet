import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { ColorPicker, ColorPickerProps } from "./ColorPicker";

export type FinalFormColorPickerProps = ColorPickerProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormColorPicker = ({ meta, input, ...restProps }: FinalFormColorPickerProps): React.ReactElement => {
    return <ColorPicker {...input} {...restProps} />;
};
