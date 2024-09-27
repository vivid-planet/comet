import { css, styled } from "@mui/material/styles";

const Root = styled("div")<Pick<Props, "align">>`
    position: absolute;
    width: 100%;

    ${({ align }) =>
        align === "top"
            ? css`
                  top: 0;
              `
            : css`
                  bottom: 0;
              `}
`;

const Highlight = styled("div")<Pick<Props, "leftSpacing">>`
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

export function PageTreeRowDivider({ align, leftSpacing, highlight }: Props) {
    return (
        <Root align={align}>
            {align === "top" && highlight && <TopHighlight leftSpacing={leftSpacing} />}
            {align === "bottom" && <>{highlight && <BottomHighlight leftSpacing={leftSpacing} />}</>}
        </Root>
    );
}
