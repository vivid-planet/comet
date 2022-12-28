import { Delete, Move, Upload } from "@comet/admin-icons";
import { Button, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
    align-items: center;
`;

const ButtonGroup = styled("div")`
    display: flex;
    gap: 10px;
`;

interface FooterProps {
    open: boolean;
    type?: "selection" | "upload";

    folderName?: string;
    numSelectedItems?: number;
}

export const Footer: React.VoidFunctionComponent<FooterProps> = ({ open, type, folderName, numSelectedItems }) => {
    const intl = useIntl();

    if (!open) {
        return null;
    }

    return (
        <FooterBar>
            <AlignTextAndImage>
                {type === "upload" && (
                    <>
                        <UploadIcon />
                        <FormattedMessage
                            id="comet.dam.file.dropFilesHereToUpload"
                            defaultMessage="Drop files here to upload them to the folder: <strong>{folderName}</strong>"
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
                    </>
                )}

                {type === "selection" && (
                    <ButtonGroup>
                        <Button variant="outlined" startIcon={<Delete />}>
                            <FormattedMessage
                                id="comet.dam.footer.delete"
                                defaultMessage="Delete {num, plural, one {one item} other {# items}}"
                                values={{
                                    num: numSelectedItems,
                                }}
                            />
                        </Button>
                        <Button variant="outlined" startIcon={<Move />}>
                            <FormattedMessage
                                id="comet.dam.footer.move"
                                defaultMessage="Move {num, plural, one {one item} other {# items}}"
                                values={{
                                    num: numSelectedItems,
                                }}
                            />
                        </Button>
                    </ButtonGroup>
                )}
            </AlignTextAndImage>
        </FooterBar>
    );
};
