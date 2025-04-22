import { Lock } from "@comet/admin-icons";
import { css } from "@mui/material/styles";
import MuiSwitch from "@mui/material/Switch";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ReadOnlyFieldLabel } from "./ReadOnlyFieldLabel";

export const ReadOnlySwitchField: FunctionComponent<{
    label?: ReactNode;
    value?: boolean;
    className?: string;
}> = ({ label, value, className }) => {
    return (
        <Wrapper className={className}>
            {label && <ReadOnlyFieldLabel label={label} />}
            <Box>
                <MuiSwitch checked={!!value} readOnly />
                <Lock fontSize="small" />
            </Box>
        </Wrapper>
    );
};

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlySwitchField",
    slotName: "wrapper",
})(
    css`
        display: flex;
        flex-direction: column;
    `,
);

const Box = createComponentSlot("div")({
    componentName: "ReadOnlySwitchField",
    slotName: "box",
})(
    () => css`
        display: flex;
        align-items: center;
        gap: 6px;
    `,
);
