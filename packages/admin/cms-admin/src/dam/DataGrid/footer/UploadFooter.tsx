import { Upload } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DamFooter } from "./DamFooter";

const UploadIcon = styled(Upload)`
    font-size: 18px;
    margin-right: 13px;
`;

const AlignTextAndImage = styled(Typography)`
    display: flex;
    align-items: center;
`;

interface DamFooterProps {
    open: boolean;
    folderName?: string;
}

export const DamUploadFooter: React.VoidFunctionComponent<DamFooterProps> = ({ open, folderName }) => {
    if (!open) {
        return null;
    }

    return (
        <DamFooter open={open}>
            <AlignTextAndImage>
                <UploadIcon />
                <FormattedMessage
                    id="comet.dam.footer.dropFilesHereToUpload"
                    defaultMessage="Drop files here to upload them to the folder: <strong>{folderName}</strong>"
                    values={{
                        strong: (chunks: string) => (
                            <strong>
                                {/*Otherwise there is no whitespace between other text and strong*/}
                                &nbsp;
                                {chunks}
                            </strong>
                        ),
                        folderName: folderName,
                    }}
                />
            </AlignTextAndImage>
        </DamFooter>
    );
};
