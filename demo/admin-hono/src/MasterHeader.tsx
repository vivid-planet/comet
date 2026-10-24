import { AppHeader, AppHeaderDropdown, AppHeaderMenuButton, FillSpace } from "@dextinity/admin";
import { DextinityLogo, Domain } from "@dextinity/admin-icons";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

const domains = ["main", "secondary"];

interface MasterHeaderProps {
    domain: string;
    onDomainChange: (domain: string) => void;
}

export function MasterHeader({ domain, onDomainChange }: MasterHeaderProps) {
    return (
        <AppHeader>
            <AppHeaderMenuButton />
            <LogoWrapper>
                <DextinityLogo variant="light" fontSize="large" />
            </LogoWrapper>
            <FillSpace />
            <AppHeaderDropdown
                startIcon={<Domain />}
                buttonChildren={<FormattedMessage id="header.domain" defaultMessage="Domain: {domain}" values={{ domain }} />}
            >
                {(closeDropdown) => (
                    <List>
                        {domains.map((option) => (
                            <ListItemButton
                                key={option}
                                selected={option === domain}
                                onClick={() => {
                                    onDomainChange(option);
                                    closeDropdown();
                                }}
                            >
                                <ListItemText primary={option} />
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </AppHeaderDropdown>
        </AppHeader>
    );
}

const LogoWrapper = styled("div")`
    display: flex;
    align-items: center;
    margin-left: ${({ theme }) => theme.spacing(3)};
`;
