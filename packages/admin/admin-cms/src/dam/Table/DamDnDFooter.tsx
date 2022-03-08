import { Upload } from "@comet/admin-icons";
import { Paper, Typography } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";

const FooterBar = styled(Paper)`
    position: fixed;
    z-index: 10;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

    min-width: 1280px;
    min-height: 60px;
    border-radius: 4px;

    background-color: ${({ theme }) => theme.palette.primary.dark};
    color: ${({ theme }) => theme.palette.primary.contrastText};

    display: flex;
    justify-content: center;
    align-items: center;
`;

const UploadIcon = styled(Upload)`
    font-size: 18px;
    margin-right: 13px;
`;

const AlignTextAndImage = styled(Typography)`
    display: flex;
`;

export type FooterType = "upload" | "move";

interface FileUploadFooterProps {
    type?: FooterType;
    open: boolean;
    folderName?: string;
}

export const DamDnDFooter = ({ type, open, folderName }: FileUploadFooterProps): React.ReactElement | null => {
    const intl = useIntl();

    if (!open) {
        return null;
    }

    return (
        <FooterBar>
            <AlignTextAndImage>
                <UploadIcon />
                {type === "upload" ? (
                    <FormattedMessage
                        id="comet.dam.file.dropFilesHereToUpload"
                        defaultMessage="Drop files here to upload them to the following folder: <strong>{folderName}</strong>"
                        values={{
                            strong: (chunks: string) => (
                                <strong>
                                    {/*Otherwise there is no whitespace between other text and strong*/}
                                    &nbsp;
                                    {chunks}
                                </strong>
                            ),
                            folderName:
                                folderName ||
                                intl.formatMessage({
                                    id: "comet.pages.dam.assetManager",
                                    defaultMessage: "Asset Manager",
                                }),
                        }}
                    />
                ) : (
                    <FormattedMessage
                        id="comet.dam.file.dropFilesHereToMove"
                        defaultMessage="Drop files here to move them to the following folder: <strong>{folderName}</strong>"
                        values={{
                            strong: (chunks: string) => (
                                <strong>
                                    {/*Otherwise there is no whitespace between other text and strong*/}
                                    &nbsp;
                                    {chunks}
                                </strong>
                            ),
                            folderName:
                                folderName ||
                                intl.formatMessage({
                                    id: "comet.pages.dam.assetManager",
                                    defaultMessage: "Asset Manager",
                                }),
                        }}
                    />
                )}
            </AlignTextAndImage>
        </FooterBar>
    );
};
