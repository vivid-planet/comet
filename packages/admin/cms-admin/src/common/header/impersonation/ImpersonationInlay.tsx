import { Reset } from "@comet/admin-icons";
import { Box, Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

import { useCurrentUser } from "../../../userPermissions/hooks/currentUser";
import { StopImpersonationButton } from "../../../userPermissions/user/ImpersonationButtons";

export function ImpersonationInlay() {
    const user = useCurrentUser();

    return (
        <Inlay padding={4}>
            <Chip color="primary" label={<FormattedMessage id="comet.impersonation.inlay.title" defaultMessage="Impersonation mode" />} />
            <Typography variant="h6" sx={{ marginTop: 3 }}>
                {user.name}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 3 }}>
                {user.email}
            </Typography>
            <StopImpersonationButton startIcon={<Reset />} variant="contained" color="secondary" />
        </Inlay>
    );
}

const Inlay = styled(Box)`
    display: flex;
    background-color: ${(props) => props.theme.palette.grey["50"]};
    align-items: start;
    justify-content: center;
    flex-direction: column;
    border-left: 2px solid;
    border-right: 2px solid;
    border-color: ${({ theme }) => theme.palette.primary.main};
`;
