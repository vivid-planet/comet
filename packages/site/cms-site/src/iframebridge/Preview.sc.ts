import styled, { css } from "styled-components";

export const Root = styled.div<ISelectionStyleProps>`
    position: relative;
`;

export interface ISelectionStyleProps {
    $isSelected: boolean;
    $isHovered: boolean;
    $showOutlines: boolean;
}
export const Selection = styled.div<ISelectionStyleProps>`
    z-index: 2;

    :after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0.25;
    }

    ${(props) => {
        if (props.$isHovered) {
            return css`
                :after {
                    background-color: #57b0eb;
                }
                border: #57b0eb solid 1px;
            `;
        } else if (props.$isSelected) {
            return css`
                border: #57b0eb solid 1px;
            `;
        } else if (props.$showOutlines) {
            return css`
                border: #dddddd dashed 1px;
            `;
        }
    }}

    &:hover {
        border: #57b0eb solid 1px;
        :after {
            background-color: #57b0eb;
        }
        cursor: pointer;
    }

    &:active {
        :after {
            background-color: #57b0eb;
        }
    }
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

export const ComponentTitle = styled.div`
    position: absolute;
    padding: 2px 2px 2px 2px;
    background-color: #57b0eb;
    line-height: 16px;
    color: white;
    right: 0;
    font-size: 12px;
`;
