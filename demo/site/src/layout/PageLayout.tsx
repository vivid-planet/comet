import { styled } from "@pigment-css/react";
import { HTMLAttributes } from "react";

const pageLayoutGridTotalColumns = 24;
const pageLayoutMaxWidth = 1920;

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
    grid?: boolean;
}

export const PageLayout = ({ grid, ...restProps }: PageLayoutProps) => <Root $grid={grid} {...restProps} />;

const Root = styled.div<{ $grid?: boolean }>({
    maxWidth: pageLayoutMaxWidth,
    margin: "0 auto",
    display: ({ $grid }) => ($grid ? "grid" : "block"),
    gridTemplateColumns: `repeat(${pageLayoutGridTotalColumns}, 1fr)`,
});
