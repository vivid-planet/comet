"use client";
import { styled } from "@pigment-css/react";

import { OverlayElementData } from "./IFrameBridge";
import { useIFrameBridge } from "./useIFrameBridge";

type PreviewOverlayElementProps = {
    element: OverlayElementData;
};

export const PreviewOverlayElement = ({ element }: PreviewOverlayElementProps) => {
    const iFrameBridge = useIFrameBridge();

    const isSelected = element.adminRoute === iFrameBridge.selectedAdminRoute;
    const isHovered = element.adminRoute === iFrameBridge.hoveredAdminRoute;

    return (
        <Root
            key={element.adminRoute}
            showBlockOutlines={iFrameBridge.showOutlines}
            blockIsSelected={isSelected}
            isHoveredInBlockList={isHovered}
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
    showBlockOutlines: boolean;
    blockIsSelected: boolean;
    isHoveredInBlockList: boolean;
};

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

// TODO: untested
const Root = styled.div<RootProps>({
    position: "absolute",
    cursor: "pointer",
    outline: "1px solid transparent",
    outlineOffset: "-1px",

    "&:after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0.25,
    },

    "&:hover": {
        outlineColor: "#29b6f6",
        outlineStyle: "solid",
        "&:after": {
            backgroundColor: "#29b6f6",
        },
    },

    variants: [
        {
            props: { isHoveredInBlockList: true },
            style: {
                outlineColor: "#29b6f6",
                outlineStyle: "solid",
                "&:after": {
                    backgroundColor: "#29b6f6",
                },
            },
        },
        {
            props: { showBlockOutlines: true, isHoveredInBlockList: false },
            style: {
                "&:not(:hover)": {
                    outlineColor: "#d9d9d9",
                    outlineStyle: "dashed",
                },
            },
        },
        {
            props: { isSelected: true },
            style: {
                outlineColor: "#29b6f6",
                [`& ${Label}`]: {
                    display: "inline-block",
                },
            },
        },
    ],
});
