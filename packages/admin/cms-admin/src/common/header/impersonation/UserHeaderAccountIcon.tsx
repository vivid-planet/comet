import { Account } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";

interface UserHeaderAccountIconProps {
    impersonated: boolean;
}

export function UserHeaderAccountIcon({ impersonated }: UserHeaderAccountIconProps) {
    return (
        <AccountIconWrapper>
            <AccountIcon active={impersonated}>
                <Account color="inherit" />
            </AccountIcon>
            {impersonated && (
                <ImpersonatedIcon active={!impersonated}>
                    <Account color="inherit" />
                </ImpersonatedIcon>
            )}
        </AccountIconWrapper>
    );
}

const AccountIcon = styled("div", {
    shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>`
    display: flex;
    align-items: center;
    color: ${({ active, theme }) => (active ? theme.palette.secondary.light : theme.palette.secondary.contrastText)};
    width: 32px;
    height: 32px;
    border-radius: 50%;
    justify-content: center;
    background-color: ${(props) => props.theme.palette.grey.A200};
    border: 1px solid ${(props) => props.theme.palette.secondary.light};
`;

const ImpersonatedIcon = styled(AccountIcon)`
    border: 2px solid ${(props) => props.theme.palette.primary.main};
    transform: translateX(-10px);
`;

const AccountIconWrapper = styled("div")`
    display: flex;
    align-items: center;
    justify-content: center;
`;
