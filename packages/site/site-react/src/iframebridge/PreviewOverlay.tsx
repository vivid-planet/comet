import styled from "styled-components";

import { PreviewOverlayElement } from "./PreviewOverlayElement";
import { useIFrameBridge } from "./useIFrameBridge";

let lastSelectedElementPath = "";

export const PreviewOverlay = () => {
    const iFrameBridge = useIFrameBridge();

    let bottomMostElementPosition = 0;

    iFrameBridge.previewElementsData.forEach((element) => {
        if (element.position.zIndex > 1) return;

        const elementBottom = element.position.top + element.position.height;
        if (elementBottom > bottomMostElementPosition) {
            bottomMostElementPosition = elementBottom;
        }
    });

    return (
        <OverlayRoot style={{ height: bottomMostElementPosition }}>
            {iFrameBridge.previewElementsData.map((element, index) => {
                const isSelected = element.adminRoute === iFrameBridge.selectedAdminRoute;

                if (isSelected && lastSelectedElementPath !== element.adminRoute) {
                    lastSelectedElementPath = element.adminRoute;
                }

                return <PreviewOverlayElement key={index} element={element} />;
            })}
        </OverlayRoot>
    );
};

const OverlayRoot = styled.div`
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    min-height: 100vh;
`;
