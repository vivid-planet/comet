import { Button, CancelButton, Loading, SaveButton } from "@comet/admin";
import { Reload } from "@comet/admin-icons";
import { useCurrentDamFolder, useDamAcceptedMimeTypes, useDamFileUpload } from "@comet/cms-admin";
import {
    Box,
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { getRandomPicsumImage, type PicsumImage } from "./getRandomPicsumImage";
import PicsumIcon from "./PicsumIcon";

export const ImportFromPicsum = () => {
    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();
    const { folderId } = useCurrentDamFolder();
    const [isOpen, setIsOpen] = useState(false);
    const [picsumImage, setPicsumImage] = useState<PicsumImage>();

    const { uploadFiles } = useDamFileUpload({
        acceptedMimetypes: allAcceptedMimeTypes,
    });

    const handleOpenDialog = async () => {
        setIsOpen(true);
        const image = await getRandomPicsumImage();
        setPicsumImage(image);
    };

    const handleCloseDialog = () => {
        setIsOpen(false);
        setPicsumImage(undefined);
    };

    const handleSave = async () => {
        if (picsumImage === undefined) return;
        await uploadFiles(
            { acceptedFiles: [picsumImage.file], fileRejections: [] },
            {
                folderId,
            },
        );
    };

    const handleShuffle = async () => {
        const image = await getRandomPicsumImage();
        setPicsumImage(image);
    };

    return (
        <>
            <Button variant="textDark" startIcon={<PicsumIcon />} onClick={handleOpenDialog}>
                <FormattedMessage id="pages.dam.importFromPicsum" defaultMessage="Import from Picsum" />
            </Button>
            <Dialog open={isOpen} onClose={handleCloseDialog}>
                <div>
                    <DialogTitle>
                        <FormattedMessage id="pages.dam.importFromPicsum" defaultMessage="Import from Picsum" />
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ aspectRatio: "16/9", lineHeight: 0 }}>
                            {picsumImage ? <ImagePreview src={picsumImage?.url} alt="image" /> : <Loading behavior="fillParent" />}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <CancelButton onClick={handleCloseDialog} />
                        <Button variant="textDark" startIcon={<Reload />} onClick={handleShuffle}>
                            <FormattedMessage id="pages.dam.importFromPicsum.dialog.shuffle" defaultMessage="Shuffle" />
                        </Button>
                        <SaveButton
                            onClick={async () => {
                                await handleSave();
                                handleCloseDialog();
                            }}
                        />
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
};

const ImagePreview = styled("img")`
    max-width: 100%;
`;
