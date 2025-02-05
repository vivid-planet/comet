import { styled } from "@mui/material/styles";

export const Root = styled("div")`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
`;

export const TopSpot = styled("div")`
    position: absolute;
    top: -13px;
    pointer-events: all;
`;

export const BottomSpot = styled("div")`
    position: absolute;
    bottom: -13px;
    pointer-events: all;
`;
