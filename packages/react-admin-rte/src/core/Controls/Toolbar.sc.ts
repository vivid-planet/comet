import { styled } from "@vivid-planet/react-admin-mui";

export const Root = styled.div`
    display: flex;
    flex-wrap: wrap;
    background-color: ${({ theme }) => theme.palette.grey[50]};
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
        background-color: ${({ theme }) => theme.palette.grey[100]};
    }

    :after {
        content: "";
        position: absolute;
        top: 8px;
        right: 0;
        bottom: 8px;
        width: 1px;
        background-color: ${({ theme }) => theme.palette.grey[100]};
    }

    :last-child {
        margin-right: 0;

        :after {
            display: none;
        }
    }
`;
