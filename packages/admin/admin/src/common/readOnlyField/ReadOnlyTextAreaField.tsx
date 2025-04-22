import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ReadOnlyFieldLabel } from "./ReadOnlyFieldLabel";

export const ReadOnlyTextAreaField: FunctionComponent<{
    label?: ReactNode;
    value?: string | null;
    className?: string;
}> = ({ label, value, className }) => (
    <Wrapper className={className}>
        {label && <ReadOnlyFieldLabel label={label} />}
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
