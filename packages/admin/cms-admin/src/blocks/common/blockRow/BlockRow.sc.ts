import { css, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";

export const AddContainer = styled("div")`
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
`;

interface RootStyleProps {
    isMouseHover: boolean;
    slideIn: boolean;
}

const slideInAnimation = keyframes`
    from { 
        transform: translateX(100%);
    }

    to { 
        transform: translateX(0);
    }
`;

export const BlockWrapper = styled("div")`
    position: relative;

    &:hover ${`${AddContainer}`} {
        display: block;
    }
`;

export const Root = styled("div", { shouldForwardProp: (prop) => prop !== "isMouseHover" && prop !== "slideIn" })<RootStyleProps>`
    position: relative;
    display: flex;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    will-change: transform;

    ${(props) =>
        props.isMouseHover &&
        css`
            background-color: ${props.theme.palette.grey[50]};
        `}

    ${({ slideIn }) =>
        slideIn &&
        css`
            animation: ${slideInAnimation} 0.5s linear;
        `}
`;

export const BlockGrabber = styled("div")`
    position: relative;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    flex-shrink: 0;
    border-right: 1px solid ${({ theme }) => theme.palette.divider};
    cursor: move;
    transition:
        background-color 200ms,
        color 200ms;
    color: ${({ theme }) => theme.palette.grey[600]};

    :hover {
        background-color: ${({ theme }) => theme.palette.primary.light};
        color: white;
    }
`;

export const InnerBlock = styled("div")`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    padding-right: 8px;
    min-width: 0;
`;

export const SelectBlock = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    flex-shrink: 0;
    position: relative;
    z-index: 11;
`;

export const OuterContent = styled("div")`
    padding-top: 15px;
    padding-bottom: 15px;
    flex-grow: 1;
    min-width: 0;
`;

export const ButtonContainer = styled("div")`
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 11;
`;

export const Content = styled("div")`
    padding-right: 10px;
`;

export const PreviewTextContainer = styled("div")`
    // Prevent unintended increase in width of child with long text and "white-space: nowrap;" (https://stackoverflow.com/a/37187431/4625218)
    display: table;
    width: 100%;
    table-layout: fixed;
`;

export const RowClickContainer = styled("div")`
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    cursor: pointer;
`;
