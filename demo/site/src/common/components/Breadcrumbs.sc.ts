import styled from "styled-components";

export const Container = styled.div`
    padding: 30px 0;
    grid-column: 2 / 24;
`;

export const Link = styled.a`
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: none;

    font-size: 14px;

    :last-child {
        font-weight: 500;
        color: ${({ theme }) => theme.palette.text.primary};
    }
`;

export const Divider = styled.span`
    display: inline-block;
    width: 15px;
    height: 1px;
    margin: 0 10px 5px 10px;
    background-color: ${({ theme }) => theme.palette.primary.light};
`;

export const GridRoot = styled.div`
    display: grid;
    grid-template-columns: repeat(24, 1fr);
`;
