import { useCookieApi } from "@comet/cms-site";
import styled from "styled-components";

type Props = {
    variant: "loading" | "fallback";
};

export const CookiePlaceholder = ({ variant }: Props) => {
    const { openCookieSettings } = useCookieApi();
    return (
        <Root>
            {variant === "loading" && <h4>Loading cookie provider...</h4>}
            {variant === "fallback" && (
                <>
                    <h4>Cookies need to be accepted to view this content.</h4>
                    <button onClick={() => openCookieSettings()}>Open Cookie Settings</button>
                </>
            )}
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
