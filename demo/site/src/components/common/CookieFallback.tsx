import { useCookieApi } from "@src/util/cookies";
import styled from "styled-components";

import { Typography } from "./Typography";

export const CookieFallback = () => {
    const { openCookieSettings } = useCookieApi();
    return (
        <Root>
            <Typography variant="paragraph350">Cookies need to be accepted to view this content.</Typography>
            <button onClick={() => openCookieSettings()}>Open Cookie Settings</button>
        </Root>
    );
};

const Root = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.n200};
`;
