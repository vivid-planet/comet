import { styled } from "@pigment-css/react";
import { createShouldForwardPropBlockList } from "@src/util/createShouldForwardPropBlockList";
import { PropsWithChildren } from "react";

type TypographyVariant = "h600" | "h550" | "h500" | "h450" | "h400" | "h350" | "p300" | "p200";

//TODO: handle as mapping
/*
const variantToElementMap: Record<TypographyVariant, "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"> = {
    h600: "h1",
    h550: "h2",
    h500: "h3",
    h450: "h4",
    h400: "h5",
    h350: "h6",
    p300: "p",
    p200: "p",
};*/

export type TypographyProps = {
    variant?: TypographyVariant;
    bottomSpacing?: boolean;
    as?: unknown;
};

export const Typography = ({ children, variant = "p300", bottomSpacing }: PropsWithChildren<TypographyProps>) => {
    return <StyledDiv variant={variant}>{children}</StyledDiv>;
};

const StyledDiv = styled("div", {
    shouldForwardProp: createShouldForwardPropBlockList(["bottomSpacing"]),
})<TypographyProps>(({ theme }) => ({
    marginTop: 0,
    fontFamily: theme.fontFamily,
    variants: [
        {
            props: { variant: "h600" },
            style: {
                fontSize: "32px",
                lineHeight: "35px",
                fontWeight: 700,
                marginBottom: "20px",
                [theme.breakpoints.sm.mediaQuery]: {
                    fontSize: "48px",
                    lineHeight: "53px",
                    marginBottom: "24px",
                },
                [theme.breakpoints.md.mediaQuery]: {
                    fontSize: "61px",
                    lineHeight: "67px",
                    marginBottom: "32px",
                },
                [theme.breakpoints.lg.mediaQuery]: {
                    fontSize: "90px",
                    lineHeight: "99px",
                    marginBottom: "40px",
                },
            },
        },
        {
            props: { variant: "h550" },
            style: {
                fontSize: "29px",
                lineHeight: "32px",
                fontWeight: 700,
                marginBottom: "18px",
                [theme.breakpoints.sm.mediaQuery]: {
                    fontSize: "39px",
                    lineHeight: "43px",
                    marginBottom: "20px",
                },
                [theme.breakpoints.md.mediaQuery]: {
                    fontSize: "48px",
                    lineHeight: "53px",
                    marginBottom: "24px",
                },
                [theme.breakpoints.lg.mediaQuery]: {
                    fontSize: "67px",
                    lineHeight: "74px",
                    marginBottom: "30px",
                },
            },
        },
        {
            props: { variant: "h500" },
            style: {
                fontSize: "26px",
                lineHeight: "29px",
                fontWeight: 700,
                marginBottom: "18px",
                [theme.breakpoints.sm.mediaQuery]: {
                    fontSize: "33px",
                    lineHeight: "36px",
                    marginBottom: "20px",
                },
                [theme.breakpoints.md.mediaQuery]: {
                    fontSize: "39px",
                    lineHeight: "43px",
                    marginBottom: "24px",
                },
                [theme.breakpoints.lg.mediaQuery]: {
                    fontSize: "50px",
                    lineHeight: "55px",
                    marginBottom: "30px",
                },
            },
        },
        {
            props: { variant: "h450" },
            style: {
                fontSize: "23px",
                lineHeight: "26px",
                fontWeight: 700,
                marginBottom: "16px",
                [theme.breakpoints.sm.mediaQuery]: {
                    fontSize: "28px",
                    lineHeight: "31px",
                    marginBottom: "18px",
                },
                [theme.breakpoints.md.mediaQuery]: {
                    fontSize: "31px",
                    lineHeight: "34px",
                    marginBottom: "20px",
                },
                [theme.breakpoints.lg.mediaQuery]: {
                    fontSize: "38px",
                    lineHeight: "42px",
                    marginBottom: "22px",
                },
            },
        },
        {
            props: { variant: "h400" },
            style: {
                fontSize: "20px",
                lineHeight: "22px",
                fontWeight: 700,
                marginBottom: "16px",
                [theme.breakpoints.sm.mediaQuery]: {
                    fontSize: "23px",
                    lineHeight: "25px",
                    marginBottom: "16px",
                },
                [theme.breakpoints.md.mediaQuery]: {
                    fontSize: "25px",
                    lineHeight: "28px",
                    marginBottom: "18px",
                },
                [theme.breakpoints.lg.mediaQuery]: {
                    fontSize: "28px",
                    lineHeight: "31px",
                    marginBottom: "18px",
                },
            },
        },
        {
            props: { variant: "h350" },
            style: {
                fontSize: "18px",
                lineHeight: "20px",
                fontWeight: 700,
                marginBottom: "16px",
                [theme.breakpoints.sm.mediaQuery]: {
                    fontSize: "20px",
                    lineHeight: "22px",
                    marginBottom: "16px",
                },
                [theme.breakpoints.md.mediaQuery]: {
                    fontSize: "21px",
                    lineHeight: "23px",
                    marginBottom: "18px",
                },
                [theme.breakpoints.lg.mediaQuery]: {
                    fontSize: "22px",
                    lineHeight: "24px",
                    marginBottom: "18px",
                },
            },
        },
        {
            props: { variant: "p300" },
            style: {
                fontSize: "16px",
                lineHeight: "22px",
                fontWeight: 400,
                marginBottom: "16px",
                [theme.breakpoints.md.mediaQuery]: {
                    fontSize: "17px",
                    lineHeight: "24px",
                    marginBottom: "17px",
                },
                [theme.breakpoints.lg.mediaQuery]: {
                    fontSize: "18px",
                    lineHeight: "26px",
                    marginBottom: "18px",
                },
            },
        },
        {
            props: { variant: "p200" },
            style: {
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                marginBottom: "14px",
                [theme.breakpoints.md.mediaQuery]: {
                    fontSize: "15px",
                    lineHeight: "22px",
                    marginBottom: "15px",
                },
            },
        },
    ],
}));

/*export const Typography2 = styled.div.attrs<{
    as?: unknown;
    variant?: TypographyVariant;
    bottomSpacing?: boolean;
}>((props) => ({ as: props.as ?? variantToElementMap[props.variant ?? "p300"] }))`

// TODO: add disable bottomSpacing
    ${({ theme, bottomSpacing }) =>
        !bottomSpacing &&
        css`
            margin-bottom: 0;

            ${theme.breakpoints.xs.mediaQuery} {
                margin-bottom: 0;
            }
        `};
`;
*/

//export type TypographyProps = ComponentProps<typeof Typography>;
