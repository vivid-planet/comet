import { styled } from "@pigment-css/react";

export type ButtonVariant = "contained" | "outlined" | "text";

type ButtonStyleProps = {
    variant?: ButtonVariant;
};
export const Button = styled("button")<ButtonStyleProps>(({ theme }) => ({
    display: "inline-flex",
    padding: `${theme.spacing.S400} ${theme.spacing.S500}`,
    borderRadius: "4px",
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.2s ease-out, color 0.2s ease-out, border-color 0.2s ease-out",
    textAlign: "center",
    textDecoration: "none",
    fontFamily: theme.fontFamily,
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "110%",
    variants: [
        {
            props: { variant: "contained" },
            style: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                border: `1px solid ${theme.palette.primary.main}`,

                "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    borderColor: theme.palette.primary.dark,
                },
                "&:disabled": {
                    pointerEvents: "none",
                    backgroundColor: theme.palette.gray["50"],
                    color: theme.palette.gray["400"],
                    borderColor: theme.palette.gray["200"],
                },
            },
        },

        {
            props: { variant: "outlined" },
            style: {
                backgroundColor: "transparent",
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}`,
                "&:hover": {
                    color: theme.palette.primary.dark,
                    borderColor: theme.palette.primary.dark,
                },
                "&:disabled": {
                    pointerEvents: "none",
                    color: theme.palette.gray["300"],
                    borderColor: theme.palette.gray["200"],
                },
            },
        },
        {
            props: { variant: "text" },
            style: {
                backgroundColor: "transparent",
                color: theme.palette.primary.main,
                border: "1px solid transparent",
                "&:hover": {
                    color: theme.palette.primary.dark,
                },
                "&:disabled": {
                    pointerEvents: "none",
                    color: theme.palette.gray["300"],
                },
            },
        },
    ],
}));
