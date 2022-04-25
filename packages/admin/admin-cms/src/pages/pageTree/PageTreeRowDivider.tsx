import { Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

const Root = styled("div")`
    position: relative;
    grid-column: 1 / 5;
`;

interface HighlightProps {
    leftSpacing: number;
}

const Highlight = styled("div")<HighlightProps>`
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.palette.divider};

    &:after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: ${({ leftSpacing }) => leftSpacing}px;
        right: 0;
        background-color: ${({ theme }) => theme.palette.primary.main};
    }
`;

const TopHighlight = styled(Highlight)`
    top: -1px;
`;

const BottomHighlight = styled(Highlight)`
    top: 0;
`;

interface Props {
    align: "top" | "bottom";
    leftSpacing: number;
    highlight: boolean;
}

export function PageTreeRowDivider({ align, leftSpacing, highlight }: Props): React.ReactElement {
    return (
        <Root>
            {align === "top" && highlight && <TopHighlight leftSpacing={leftSpacing} />}
            {align === "bottom" && (
                <>
                    <Divider />
                    {highlight && <BottomHighlight leftSpacing={leftSpacing} />}
                </>
            )}
        </Root>
    );
}
