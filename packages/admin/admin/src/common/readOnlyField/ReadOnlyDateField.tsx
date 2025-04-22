import { Calendar, Lock } from "@comet/admin-icons";
import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ReadOnlyFieldLabel } from "./ReadOnlyFieldLabel";

export const ReadOnlyDateField: FunctionComponent<{
    label?: ReactNode;
    value?: Date | string | undefined;
    className?: string;
}> = ({ label, value, className }) => {
    const date = value instanceof Date ? value : value ? new Date(value) : undefined;

    return (
        <Wrapper className={className}>
            {label && <ReadOnlyFieldLabel label={label} />}
            <Box>
                <InnerBox>
                    <Calendar />
                    {date ? date.toLocaleDateString() : "—"}
                </InnerBox>
                <Lock />
            </Box>
        </Wrapper>
    );
};

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlyDateField",
    slotName: "wrapper",
})(
    css`
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 4px;
    `,
);

const Box = createComponentSlot("div")({
    componentName: "ReadOnlyDateField",
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
    `,
);

const InnerBox = createComponentSlot("div")({
    componentName: "ReadOnlyDateField",
    slotName: "innerBox",
})(
    css`
        display: flex;
        align-items: center;
        gap: 5px;
    `,
);
