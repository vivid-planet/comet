import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { StartBuildsDialog } from "./StartBuildsDialog";

export const PublishButton: React.FunctionComponent = () => {
    const [isStartBuildsDialogOpen, setIsStartBuildsDialogOpen] = React.useState(false);

    const handlePublishClick = () => {
        setIsStartBuildsDialogOpen(true);
    };

    return (
        <Root>
            <Button variant="contained" color="primary" onClick={handlePublishClick} disabled={process.env.NODE_ENV === "development"} fullWidth>
                <FormattedMessage id="comet.pages.publisher.build" defaultMessage="Start builds" />
            </Button>
            <StartBuildsDialog
                open={isStartBuildsDialogOpen}
                onClose={() => {
                    setIsStartBuildsDialogOpen(false);
                }}
            />
        </Root>
    );
};

const Root = styled("div")`
    position: relative;
    width: 100%;
    margin: ${({ theme }) => theme.spacing(1)};
`;
