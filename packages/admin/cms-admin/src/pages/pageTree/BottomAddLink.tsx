import { messages } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Button, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

interface Props {
    onClick: () => void;
}

export default function BottomAddLink({ onClick }: Props): React.ReactElement {
    return (
        <>
            <Divider />
            <AddButton color="primary" onClick={onClick} startIcon={<Add />} fullWidth>
                <FormattedMessage {...messages.add} />
            </AddButton>
        </>
    );
}

const AddButton = styled(Button)`
    padding-top: 17px;
    padding-bottom: 17px;
`;
