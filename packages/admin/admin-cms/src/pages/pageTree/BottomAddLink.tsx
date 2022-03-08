import { Add } from "@comet/admin-icons";
import { Button, Divider } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

interface Props {
    onClick: () => void;
}

export default function BottomAddLink({ onClick }: Props): React.ReactElement {
    return (
        <>
            <Divider />
            <AddButton color="primary" onClick={onClick} startIcon={<Add />} fullWidth>
                <FormattedMessage id="comet.generic.add" defaultMessage="Add" />
            </AddButton>
        </>
    );
}

const AddButton = styled(Button)`
    padding-top: 17px;
    padding-bottom: 17px;
`;
