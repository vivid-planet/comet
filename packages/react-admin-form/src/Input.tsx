import MuiInputBase, { InputBaseProps } from "@material-ui/core/InputBase";
import { styled } from "@vivid-planet/react-admin-mui";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export const StyledInput = styled(({ ...props }: InputBaseProps) => <MuiInputBase classes={{ root: "root", focused: "focused" }} {...props} />)<
    InputBaseProps
>`
    &.root {
        border: 1px solid #d8dbdf;
        border-radius: 2px;
        background-color: #ffffff;
        padding: 0px 10px;
    }
    textarea {
        padding: 6px 0px 8px 0;
    }
    &.root.focused {
        border-color: #0081b8;
    }

    input {
        height: 19px;
    }
`;

export const Input: React.FunctionComponent<InputBaseProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>> = ({
    meta,
    input,
    innerRef,
    ...props
}) => <StyledInput {...input} {...props} />;
