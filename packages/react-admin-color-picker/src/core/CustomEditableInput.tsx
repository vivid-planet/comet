import * as React from "react";
import { ColorChangeHandler } from "react-color";
// tslint:disable-next-line: no-submodule-imports
import { EditableInput } from "react-color/lib/components/common";
import * as tinycolor from "tinycolor2";

interface IComponentProps {
    value: string;
    pickedColorIndicatorClass: string;
    onChange: (value?: string) => void;
}

const CustomEditableInput: React.FC<IComponentProps> = ({ value, onChange, pickedColorIndicatorClass }) => (
    <>
        <div className={pickedColorIndicatorClass} style={{ background: value ? tinycolor(value).toHexString() : undefined }} />
        <EditableInput style={{ input: { border: "none", outline: "none" } }} value={value} onChange={(onChange as unknown) as ColorChangeHandler} />
    </>
);

export default CustomEditableInput;
