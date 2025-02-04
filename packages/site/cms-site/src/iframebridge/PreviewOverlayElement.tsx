import styled, { css } from "styled-components";

import { type OverlayElementData } from "./IFrameBridge";
import { useIFrameBridge } from "./useIFrameBridge";

type Props = {
    element: OverlayElementData;
};

export const PreviewOverlayElement = ({ element }: Props) => {
    const iFrameBridge = useIFrameBridge();

    const isSelected = element.adminRoute === iFrameBridge.selectedAdminRoute;
    const isHovered = element.adminRoute === iFrameBridge.hoveredAdminRoute;

    return (
        <Root
            key={element.adminRoute}
            $showBlockOutlines={iFrameBridge.showOutlines}
            $blockIsSelected={isSelected}
            $isHoveredInBlockList={isHovered}
            title={element.label}
            onClick={() => {
                iFrameBridge.sendSelectComponent(element.adminRoute);
            }}
            onMouseEnter={() => {
                iFrameBridge.sendHoverComponent(element.adminRoute);
            }}
            onMouseLeave={() => {
                iFrameBridge.sendHoverComponent(null);
            }}
            style={element.position}
        >
            <Label>{element.label}</Label>
        </Root>
    );
};

type RootProps = {
    $showBlockOutlines: boolean;
    $blockIsSelected: boolean;
    $isHoveredInBlockList: boolean;
};

const elementHoverStyles = css`
    outline-color: #29b6f6;
    outline-style: solid;

    &:after {
        background-color: #29b6f6;
    }
`;

const Root = styled.div<RootProps>`
    position: absolute;
    cursor: pointer;
    outline: 1px solid transparent;
    outline-offset: -1px;

    &:after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0.25;
    }

    &:hover {
        ${elementHoverStyles}
    }

    ${({ $isHoveredInBlockList }) => $isHoveredInBlockList && elementHoverStyles}

    ${({ $showBlockOutlines, $isHoveredInBlockList }) =>
        Boolean($showBlockOutlines && !$isHoveredInBlockList) &&
        css`
            &:not(:hover) {
                outline-color: #d9d9d9;
                outline-style: dashed;
            }
        `}

    ${({ $blockIsSelected }) =>
        $blockIsSelected &&
        css`
            outline-color: #29b6f6;

            ${Label} {
                display: inline-block;
            }
        `}
`;

const Label = styled.div`
    position: absolute;
    padding: 2px 2px 2px 2px;
    background-color: #57b0eb;
    line-height: 16px;
    color: white;
    top: 1px;
    right: 1px;
    font-size: 12px;
    display: none;
`;
