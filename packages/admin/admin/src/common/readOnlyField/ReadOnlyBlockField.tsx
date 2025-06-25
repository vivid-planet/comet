import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ReadOnlyFieldLabel } from "./ReadOnlyFieldLabel";

export const ReadOnlyBlockField: FunctionComponent<{
    label?: ReactNode;
    value?: string;
    className?: string;
}> = ({ label, value, className }) => {
    return (
        <Wrapper className={className}>
            {label && <ReadOnlyFieldLabel label={label} />}
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

const Box = createComponentSlot("div")({
    componentName: "ReadOnlyBlockField",
    slotName: "box",
})(
    () => css`
        display: flex;
        align-items: center;
    `,
);
