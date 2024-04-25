"use client";
import { useColorTheme } from "@src/blocks/ColorThemeContext";
import { typographyStyles } from "@src/components/common/Typography.styles";
import * as React from "react";
import styled, { css } from "styled-components";

export type TypographyVariant =
    | "headline600"
    | "headline550"
    | "headline500"
    | "headline450"
    | "headline400"
    | "headline350"
    | "paragraph350"
    | "paragraph300"
    | "paragraph250"
    | "paragraph200"
    | "paragraph150"
    | "paragraph100"
    | "list";

export const Typography = ({ component = "div", variant, disableMargin = false, children }: Props): React.ReactElement => {
    const colorTheme = useColorTheme();

    return (
        <Text component={component} colorTheme={colorTheme} disableMargin={disableMargin} variant={variant} as={component}>
            {children}
        </Text>
    );
};

interface Props {
    component?: keyof HTMLElementTagNameMap;
    variant: TypographyVariant;
    disableMargin?: boolean;
    children: React.ReactNode;
    colorTheme?: "Default" | "GreyN1" | "GreyN2" | "GreyN3" | "DarkBlue";
}

const Text = styled.div<Props>`
    ${({ variant, disableMargin, theme }) => typographyStyles[variant](theme, disableMargin)};
    margin-top: 0;

    ${({ colorTheme }) =>
        colorTheme === "DarkBlue" &&
        css`
            color: white;
        `}
`;
