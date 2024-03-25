import { TypographyVariant } from "@src/components/common/Typography";
import { Theme } from "@src/theme";
import { css } from "styled-components";

type TypographyStyles = {
    // TODO styled-components v6 update type fix
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in TypographyVariant]: (theme: Theme, disableMargin?: boolean) => any;
};

export const typographyStyles: TypographyStyles = {
    headline600: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 40px;
        font-weight: 900;
        margin-bottom: ${disableMargin ? 0 : "20px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 52px;
        }

        ${theme.breakpoints.b1280.mediaQuery} {
            font-size: 64px;
            margin-bottom: ${disableMargin ? 0 : "30px"};
        }
    `,
    headline550: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 36px;
        font-weight: 900;
        margin-bottom: ${disableMargin ? 0 : "20px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 44px;
        }

        ${theme.breakpoints.b1280.mediaQuery} {
            font-size: 50px;
            margin-bottom: ${disableMargin ? 0 : "30px"};
        }
    `,
    headline500: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 30px;
        font-weight: 900;
        margin-bottom: ${disableMargin ? 0 : "20px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 38px;
        }

        ${theme.breakpoints.b1280.mediaQuery} {
            font-size: 46px;
            margin-bottom: ${disableMargin ? 0 : "30px"};
        }
    `,
    headline450: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 26px;
        font-weight: 900;
        margin-bottom: ${disableMargin ? 0 : "20px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 34px;
        }

        ${theme.breakpoints.b1280.mediaQuery} {
            font-size: 40px;
            margin-bottom: ${disableMargin ? 0 : "30px"};
        }
    `,
    headline400: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 22px;
        font-weight: 900;
        margin-bottom: ${disableMargin ? 0 : "15px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 30px;
        }

        ${theme.breakpoints.b1280.mediaQuery} {
            font-size: 36px;
            margin-bottom: ${disableMargin ? 0 : "25px"};
        }
    `,
    headline350: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 22px;
        font-weight: 900;
        margin-bottom: ${disableMargin ? 0 : "15px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 26px;
        }

        ${theme.breakpoints.b1280.mediaQuery} {
            font-size: 30px;
            margin-bottom: ${disableMargin ? 0 : "25px"};
        }
    `,
    paragraph100: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 12px;
        margin-bottom: ${disableMargin ? 0 : "10px"};
    `,
    paragraph150: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 14px;
        margin-bottom: ${disableMargin ? 0 : "10px"};
    `,
    paragraph200: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 16px;
        margin-bottom: ${disableMargin ? 0 : "10px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 18px;
        }
    `,
    paragraph250: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 16px;
        margin-bottom: ${disableMargin ? 0 : "15px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 18px;
        }

        ${theme.breakpoints.b1280.mediaQuery} {
            font-size: 20px;
        }
    `,
    paragraph300: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 18px;
        margin-bottom: ${disableMargin ? 0 : "15px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 22px;
        }

        ${theme.breakpoints.b1280.mediaQuery} {
            font-size: 24px;
        }
    `,
    paragraph350: (theme: Theme, disableMargin?: boolean) => css`
        font-size: 22px;
        margin-bottom: ${disableMargin ? 0 : "15px"};

        ${theme.breakpoints.b960.mediaQuery} {
            font-size: 26px;
        }

        ${theme.breakpoints.b1280.mediaQuery} {
            font-size: 30px;
        }
    `,
    list: (theme: Theme, disableMargin?: boolean) => css``,
};
