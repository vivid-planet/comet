import * as React from "react";
import { styled } from "../styled-components";

interface IMenuItemsWrapperProps {
    width: React.CSSProperties["width"];
}

export const MenuItemsWrapper = styled.div<IMenuItemsWrapperProps>`
    width: ${({ width }) => width};
    margin-top: 20px;
`;
