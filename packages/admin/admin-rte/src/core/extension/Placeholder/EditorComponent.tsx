import { css, styled } from "@mui/material/styles";
import { type PropsWithChildren } from "react";

const EditorComponent = ({ children }: PropsWithChildren) => {
    return <Root>{children}</Root>;
};

const Root = styled("span")(
    ({ theme }) => css`
        background-color: ${theme.palette.primary.light};
        color: ${theme.palette.primary.contrastText};
        border-radius: ${theme.shape.borderRadius}px;
        padding: 1px 4px;
        font-size: 0.85em;
        user-select: all;
    `,
);

export default EditorComponent;
