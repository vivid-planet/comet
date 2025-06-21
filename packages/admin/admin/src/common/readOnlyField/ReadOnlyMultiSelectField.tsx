import { Lock } from "@comet/admin-icons";
import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ReadOnlyFieldLabel } from "./ReadOnlyFieldLabel";

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
    const text = labels.length > 0 ? labels.join(", ") : "";

    return (
        <Wrapper className={className}>
            {label && <ReadOnlyFieldLabel label={label} />}
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
