import { Lock } from "@comet/admin-icons";
import { FormLabel } from "@mui/material";
import { css } from "@mui/material/styles";
import MuiSwitch from "@mui/material/Switch";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export const ReadOnlyBooleanField: FunctionComponent<{
    label?: ReactNode;
    value?: boolean;
    className?: string;
}> = ({ label, value, className }) => {
    return (
        <Wrapper className={className}>
            {label && <Label>{label}</Label>}
            <Box>
                <MuiSwitch checked={!!value} readOnly />
                <Lock fontSize="small" />
            </Box>
        </Wrapper>
    );
};

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlyBooleanField",
    slotName: "wrapper",
})(
    css`
        display: flex;
        flex-direction: column;
    `,
);

const Label = createComponentSlot(FormLabel)({
    componentName: "ReadOnlyBooleanField",
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
    componentName: "ReadOnlyBooleanField",
    slotName: "box",
})(
    () => css`
        display: flex;
        align-items: center;
        gap: 6px;
    `,
);
