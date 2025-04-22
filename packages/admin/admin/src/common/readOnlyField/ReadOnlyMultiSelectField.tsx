import { Lock } from "@comet/admin-icons";
import { FormLabel } from "@mui/material";
import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export interface Option {
    label: ReactNode;
    value: string | number;
}

export const ReadOnlyMultiSelectField: FunctionComponent<{
    label?: ReactNode;
    value?: Option[] | null;
    className?: string;
}> = ({ label, value, className }) => {
    const labels = (value ?? []).map((opt) => opt.label).filter(Boolean);
    const text = labels.length > 0 ? labels.join(", ") : "—";

    return (
        <Wrapper className={className}>
            {label && <Label>{label}</Label>}
            <Box>
                <TextContent>{text}</TextContent>
                <Lock />
            </Box>
        </Wrapper>
    );
};

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlyMultiSelectField",
    slotName: "wrapper",
})(css`
    display: flex;
    flex-direction: column;
    gap: 4px;
`);

const Label = createComponentSlot(FormLabel)({
    componentName: "ReadOnlyMultiSelectField",
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
    componentName: "ReadOnlyMultiSelectField",
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
        overflow: hidden;
        color: ${theme.palette.grey[600]};
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
);

const TextContent = createComponentSlot("span")({
    componentName: "ReadOnlyMultiSelectField",
    slotName: "textContent",
})(
    () => css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
    `,
);
