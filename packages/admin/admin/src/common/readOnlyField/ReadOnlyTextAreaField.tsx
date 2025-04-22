import { FormLabel } from "@mui/material";
import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export const ReadOnlyTextAreaField: FunctionComponent<{
    label?: ReactNode;
    value?: string | null;
    className?: string;
}> = ({ label, value, className }) => (
    <Wrapper className={className}>
        {label && <Label>{label}</Label>}
        <Box>{value || "—"}</Box>
    </Wrapper>
);

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlyTextAreaField",
    slotName: "wrapper",
})(
    css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,
);

const Label = createComponentSlot(FormLabel)({
    componentName: "ReadOnlyTextAreaField",
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

const Box = createComponentSlot("div")({
    componentName: "ReadOnlyTextAreaField",
    slotName: "box",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        background-color: white;
        padding: 10px;
        border-radius: 2px;
        border: 1px solid ${theme.palette.grey[100]};
        border-radius: 2px;
    `,
);
