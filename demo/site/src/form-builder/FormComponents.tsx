import { ReactNode } from "react";
import { FieldRenderProps } from "react-final-form";
import { css, styled } from "styled-components";

export const Label = ({ children, required, htmlFor }: { children: ReactNode; required?: boolean; htmlFor?: string }) => {
    return (
        <LabelElement htmlFor={htmlFor}>
            {children}
            {required ? "*" : ""}
        </LabelElement>
    );
};

const LabelElement = styled.label`
    display: block;
    font-size: 16px;
    line-height: 22px;
`;

const baseInputStyles = css`
    display: block;
    width: 100%;
    font-family: inherit;
    font-size: 16px;
    line-height: 22px;
    box-sizing: border-box;
`;

const TextInput = styled.input`
    ${baseInputStyles}
`;

const TextArea = styled.textarea`
    ${baseInputStyles}
    resize: vertical;
    min-height: 80px;
`;

export const FFInput = ({ meta, input, ...restProps }: FieldRenderProps<string>) => {
    return <TextInput {...input} {...restProps} />;
};

export const FFTextArea = ({ meta, input, ...restProps }: FieldRenderProps<string>) => {
    return <TextArea {...input} {...restProps} />;
};
