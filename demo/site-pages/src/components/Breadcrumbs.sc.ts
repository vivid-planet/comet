import styled from "styled-components";

export const Container = styled.div`
    padding: 30px 0;
    grid-column: 2 / 24;
`;

export const Link = styled.a`
    color: ${({ theme }) => theme.colors.n400};
    text-decoration: none;

    font-size: 14px;

    :last-child {
        font-weight: 500;
        color: ${({ theme }) => theme.colors.black};
    }
`;

export const Divider = styled.span`
    display: inline-block;
    width: 15px;
    height: 1px;
    margin: 0 10px 5px 10px;
    background-color: ${({ theme }) => theme.colors.n200};
`;
