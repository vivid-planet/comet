import { styled } from "@mui/material/styles";
import { type ReactNode } from "react";

interface Props {
    top?: ReactNode;
    bottom?: ReactNode;
}

// Layout component, a button can be on top, on bottom or on both of the tree-row
export default function InsertInBetweenAction({ top, bottom }: Props) {
    return (
        <Root>
            <TopSpot>{top}</TopSpot>
            <BottomSpot>{bottom}</BottomSpot>
        </Root>
    );
}

const Root = styled("div")`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
`;

const TopSpot = styled("div")`
    position: absolute;
    top: -14px;
    pointer-events: all;
`;

const BottomSpot = styled("div")`
    position: absolute;
    bottom: -13px;
    pointer-events: all;
`;
