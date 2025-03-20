import { Button, messages } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

interface Props {
    onClick: () => void;
}

export default function BottomAddLink({ onClick }: Props) {
    return (
        <>
            <Divider />
            <AddButton variant="textDark" onClick={onClick} startIcon={<Add />} fullWidth>
                <FormattedMessage {...messages.add} />
            </AddButton>
        </>
    );
}

const AddButton = styled(Button)`
    padding-top: 17px;
    padding-bottom: 17px;
`;
