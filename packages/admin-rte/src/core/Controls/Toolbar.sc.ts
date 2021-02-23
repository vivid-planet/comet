import styled from "styled-components";

export const Root = styled.div`
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    border-top: 1px solid ${({ theme }) => theme.rte.colors.border};
    background-color: ${({ theme }) => theme.rte.colors.toolbarBackground};
    padding-left: 6px;
    padding-right: 6px;
    overflow: hidden;
`;

export const ToolbarSlot = styled.div`
    position: relative;
    flex-shrink: 0;
    flex-grow: 0;
    height: 34px;
    box-sizing: border-box;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-right: 6px;
    margin-right: 5px;

    :before {
        content: "";
        position: absolute;
        bottom: 0;
        height: 1px;
        left: -100vw;
        right: -100vw;
        background-color: ${({ theme }) => theme.rte.colors.border};
    }

    :after {
        content: "";
        position: absolute;
        top: 8px;
        right: 0;
        bottom: 8px;
        width: 1px;
        background-color: ${({ theme }) => theme.rte.colors.border};
    }

    :last-child {
        margin-right: 0;

        :after {
            display: none;
        }
    }
`;
