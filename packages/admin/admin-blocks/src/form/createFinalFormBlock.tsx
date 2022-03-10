import React from "react";
import { FieldRenderProps } from "react-final-form";

import { BlockInterface } from "../blocks/types";
import { resolveNewState } from "../blocks/utils";

const createFinalFormBlock = (block: BlockInterface) => {
    return ({ input: { value, onChange } }: FieldRenderProps<unknown>): React.ReactElement => (
        <block.AdminComponent state={value} updateState={(setStateAction) => onChange(resolveNewState({ prevState: value, setStateAction }))} />
    );
};

export { createFinalFormBlock };
