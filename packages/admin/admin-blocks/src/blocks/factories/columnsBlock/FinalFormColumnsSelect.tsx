import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { ColumnsIcon } from "./ColumnsIcon";

interface Props extends FieldRenderProps<number> {
    columns: number[];
}

export function FinalFormColumnsSelect({ input: { value, onChange }, columns }: Props): React.ReactElement {
    return (
        <ToggleButtonGroup
            value={value}
            onChange={(event, value: number | null) => {
                if (value !== null) {
                    onChange(value);
                }
            }}
            exclusive
        >
            {columns.map((c) => (
                <ToggleButton key={c} value={c}>
                    <ColumnsIcon columns={c} />
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
