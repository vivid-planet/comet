import styled from "styled-components";

export const NextImageBottomPaddingFix = styled.div`
    > div > div {
        vertical-align: top; //solution for next/image to remove space below img https://github.com/vercel/next.js/issues/18637
    }
`;
