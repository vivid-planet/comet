import { Lock } from "@comet/admin-icons";
import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";
import { FormattedNumber } from "react-intl";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ReadOnlyFieldLabel } from "./ReadOnlyFieldLabel";

export const ReadOnlyNumberField: FunctionComponent<{
    label?: ReactNode;
    value?: number | null;
    className?: string;
}> = ({ label, value, className }) => (
    <Wrapper className={className}>
        {label && <ReadOnlyFieldLabel label={label} />}
        {value && (
            <Box>
                <FormattedNumber value={value} />
                <Lock />
            </Box>
        )}
    </Wrapper>
);

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlyNumberField",
    slotName: "wrapper",
})(
    css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,
);

const Box = createComponentSlot("div")({
    componentName: "ReadOnlyNumberField",
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
