"use client";

import { ReactNode } from "react";
import { styled } from "styled-components";

type Props = {
    children: ReactNode;
    required?: boolean;
    htmlFor?: string;
};

export const Label = ({ children, required, htmlFor }: Props) => {
    return (
        <Root htmlFor={htmlFor}>
            {children}
            {required ? "*" : ""}
        </Root>
    );
};

const Root = styled.label`
    display: block;
    font-size: 16px;
    line-height: 22px;
`;
