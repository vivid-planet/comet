import { css, FormLabel } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export const ReadOnlyFieldLabel: FunctionComponent<{
    label: ReactNode;
}> = ({ label }) => {
    return <Label>{label}</Label>;
};

const Label = createComponentSlot(FormLabel)({
    componentName: "ReadOnlySwitchField",
    slotName: "label",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        font-family: ${theme.typography.fontFamily};
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0px;
    `,
);
