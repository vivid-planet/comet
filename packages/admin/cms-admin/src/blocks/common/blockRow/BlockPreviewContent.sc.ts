import { styled } from "@mui/material/styles";

export const Root = styled("div")`
    display: flex;
    align-items: center;
`;
export const TextContainer = styled("div")``;

export const ImageContainer = styled("div")`
    display: block;
    margin-right: 12px;
    flex-shrink: 0;
    width: 64px;
    height: 64px;
`;

export const TextInnerContainer = styled("div")`
    // Prevent unintended increase in width of child with long text and "white-space: nowrap;" (https://stackoverflow.com/a/37187431/4625218)
    display: table;
    width: 100%;
    table-layout: fixed;
`;

export const IconContainer = styled("div")`
    margin-right: 10px;
`;
