import { Lock } from "@comet/admin-icons";
import { FormLabel } from "@mui/material";
import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export const ReadOnlySelectField: FunctionComponent<{
    label?: ReactNode;
    value?: { label: ReactNode; value: string | number } | null;
    className?: string;
}> = ({ label, value, className }) => (
    <Wrapper className={className}>
        {label && <Label>{label}</Label>}
        <Box>
            {value?.label && value.label}
            <Lock />
        </Box>
    </Wrapper>
);

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlySelectField",
    slotName: "wrapper",
})(
    css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,
);

const Label = createComponentSlot(FormLabel)({
    componentName: "ReadOnlySelectField",
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
    componentName: "ReadOnlySelectField",
    slotName: "box",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        background-color: ${theme.palette.grey[50]};
        padding: 10px;
        border-radius: 2px;
        border: 1px solid ${theme.palette.grey[100]};
    `,
);
