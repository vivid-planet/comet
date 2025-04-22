import { FormLabel } from "@mui/material";
import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export const ReadOnlyRichTextField: FunctionComponent<{
    label?: ReactNode;
    value?: string | null;
    className?: string;
}> = ({ label, value, className }) => {
    return (
        <Wrapper className={className}>
            {label && <Label>{label}</Label>}
            {value && <InnerBox dangerouslySetInnerHTML={{ __html: value }} />}
        </Wrapper>
    );
};

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlyRichTextField",
    slotName: "wrapper",
})(
    css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,
);

const Label = createComponentSlot(FormLabel)({
    componentName: "ReadOnlyRichTextField",
    slotName: "label",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        font-family: ${theme.typography.fontFamily};
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0px;
    `,
);

const InnerBox = createComponentSlot("div")({
    componentName: "ReadOnlyRichTextField",
    slotName: "box",
})(
    ({ theme }) => css`
        display: block;
        background-color: white;
        padding: 10px;
        border-radius: 2px;
        border: 1px solid ${theme.palette.grey[100]};
        border-radius: 2px;

        p {
            margin: 0 0 0.5em;
        }

        h1,
        h2,
        h3 {
            margin-top: 1em;
            margin-bottom: 0.5em;
        }

        ul,
        ol {
            padding-left: 1.2em;
            margin-bottom: 1em;
        }

        strong {
            font-weight: bold;
        }

        em {
            font-style: italic;
        }

        a {
            color: ${theme.palette.primary.main};
            text-decoration: underline;
        }
    `,
);
