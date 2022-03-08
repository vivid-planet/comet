import styled from "styled-components";

export const PageTreeDragLayerWrapper = styled.div`
    position: fixed;
    pointer-events: none;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
`;

export const PageTreeDragLayerInner = styled.div`
    display: flex;
`;
