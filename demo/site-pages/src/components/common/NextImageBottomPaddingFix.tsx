import styled from "styled-components";

// Workaround to remove space below image. See https://github.com/vercel/next.js/issues/18637#issuecomment-803028167 for more information.
// TODO consider adding this fix to PixelImageBlock directly.
export const NextImageBottomPaddingFix = styled.div`
    > span,
    > div > span {
        vertical-align: top;
    }
`;
