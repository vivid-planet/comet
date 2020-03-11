import styled from "styled-components";

interface IFieldBarWrapper {
    fieldBarWidth: number;
}

export const Wrapper = styled.div``;

export const FieldContainerDiv = styled.div`
    border-left: 1px solid #cecfcf;
    border-top: 1px solid #cecfcf;
    padding: 15px 15px 15px 15px;
`;

export const BarWrapper = styled.div`
    display: flex;
`;

export const SidebarInnerWrapper = styled.div``;

export const FieldBarWrapper = styled.div<IFieldBarWrapper>`
    min-width: ${({ fieldBarWidth }) => fieldBarWidth}px;

    &:last-child {
        border-right: 1px solid #cecfcf;
    }
`;

export const MoreButtonWrapper = styled.div<IFieldBarWrapper>`
    border-left: 1px solid #cecfcf;
    border-right: 1px solid #cecfcf;
    border-top: 1px solid #cecfcf;
    justify-content: center;
    display: inline-flex;
    align-items: center;
    text-align: center;
    font-size: 30px;
    flex-grow: 1;
`;
