"use client";
import { createGlobalStyle } from "styled-components";

const ResponsiveSpacingStyle = createGlobalStyle`
    :root {
        --spacing-d400: 72px;
        --spacing-d300: 44px;
        --spacing-d200: 28px;
        --spacing-d100: 20px;
        --spacing-s600: 32px;
        --spacing-s500: 24px;
        --spacing-s400: 16px;
        --spacing-s300: 12px;
        --spacing-s200: 8px;
        --spacing-s100: 4px;
    }

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        :root {
            --spacing-d400: 96px;
            --spacing-d300: 68px;
            --spacing-d200: 52px;
            --spacing-d100: 24px;
        }
    }

    ${({ theme }) => theme.breakpoints.md.mediaQuery} {
        :root {
            --spacing-d400: 120px;
            --spacing-d300: 84px;
            --spacing-d200: 64px;
            --spacing-d100: 32px;
        }
    }

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        :root {
            --spacing-d400: 172px;
            --spacing-d300: 100px;
            --spacing-d200: 72px;
            --spacing-d100: 48px;
        }
    }
`;

export { ResponsiveSpacingStyle };
