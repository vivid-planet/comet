import { Info } from "@comet/admin-icons";
import React from "react";
import { FormattedMessage } from "react-intl";

import { HeaderButton } from "../Header.sc";
import { AboutModal } from "./AboutModal";

export function HeaderAboutButton(): React.ReactElement {
    const [showAboutModal, setShowAboutModal] = React.useState(false);

    return (
        <>
            <HeaderButton
                fullWidth={true}
                startIcon={<Info />}
                onClick={() => {
                    setShowAboutModal(true);
                }}
                color="info"
            >
                <FormattedMessage id="comet.about" defaultMessage="About" />
            </HeaderButton>
            <AboutModal
                open={showAboutModal}
                onClose={() => {
                    setShowAboutModal(false);
                }}
            />
        </>
    );
}
