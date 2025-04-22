import { FormLabel } from "@mui/material";
import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export const ReadOnlyBlockField: FunctionComponent<{
    label?: ReactNode;
    value?: string;
    className?: string;
}> = ({ label, value, className }) => {
    return (
        <Wrapper className={className}>
            {label && <Label>{label}</Label>}
            {value && <Box>{value}</Box>}
        </Wrapper>
    );
};

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlyBlockField",
    slotName: "wrapper",
})(
    css`
        display: flex;
        flex-direction: column;
    `,
);

const Label = createComponentSlot(FormLabel)({
    componentName: "ReadOnlyBlockField",
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
    componentName: "ReadOnlyBlockField",
    slotName: "box",
})(
    () => css`
        display: flex;
        align-items: center;
    `,
);
