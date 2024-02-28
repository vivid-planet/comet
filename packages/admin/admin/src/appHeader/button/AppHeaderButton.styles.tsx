import { ButtonBase, Typography } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export type AppHeaderButtonClassKey = "root" | "content" | "startIcon" | "endIcon" | "typography";

export const Root = styled(ButtonBase, {
    name: "CometAdminAppHeaderButton",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    height: 100%;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
`);

export const Content = styled("div", {
    name: "CometAdminAppHeaderButton",
    slot: "content",
    overridesResolver(_, styles) {
        return [styles.content];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-width: var(--header-height);
        box-sizing: border-box;
        padding-left: ${theme.spacing(4)};
        padding-right: ${theme.spacing(4)};
    `,
);

export const StartIcon = styled("div", {
    name: "CometAdminAppHeaderButton",
    slot: "startIcon",
    overridesResolver(_, styles) {
        return [styles.startIcon];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;

        &:not(:last-child) {
            margin-right: ${theme.spacing(2)};
        }
    `,
);

export const EndIcon = styled("div", {
    name: "CometAdminAppHeaderButton",
    slot: "endIcon",
    overridesResolver(_, styles) {
        return [styles.endIcon];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;

        &:not(:first-child) {
            margin-left: ${theme.spacing(2)};
        }
    `,
);

export const Text = styled(Typography, {
    name: "CometAdminAppHeaderButton",
    slot: "typography",
    overridesResolver(_, styles) {
        return [styles.typography];
    },
})(css``) as typeof Typography;
