import { useCookieApi } from "@comet/site-nextjs";
import styled from "styled-components";

export const LoadingCookiePlaceholder = () => (
    <Root>
        <h4>Loading cookie provider...</h4>
    </Root>
);

export const FallbackCookiePlaceholder = () => {
    const { openCookieSettings } = useCookieApi();

    return (
        <Root>
            <h4>Cookies need to be accepted to view this content.</h4>
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
    background-color: ${({ theme }) => theme.palette.primary.light};
`;
