import styled from "styled-components";

export const ProgressOverlayContainer = styled.div`
    position: relative;
    min-height: 500px;
    z-index: 1;
`;

export const TableCircularProgressContainer = styled.div`
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -50%);
    justify-content: center;
    background-color: white;
    border-radius: 10px;
    align-items: center;
    position: absolute;
    margin: 0 auto;
    height: 100px;
    width: 100px;
    display: flex;
    left: 50%;
    top: 50%;
`;

export const ProgressContainer = styled.div`
    padding-top: 30px;
    display: flex;
    justify-content: center;
`;
