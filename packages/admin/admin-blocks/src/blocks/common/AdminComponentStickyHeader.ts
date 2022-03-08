import styled from "styled-components";

export const AdminComponentStickyHeader = styled.div`
    position: sticky;
    top: 40px;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    z-index: 15;
`;
