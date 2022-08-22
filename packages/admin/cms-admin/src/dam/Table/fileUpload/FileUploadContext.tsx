import React from "react";

interface FileUploadContextApi {
    newlyUploadedFileIds: string[];
    addNewlyUploadedFileIds: (newlyUploadedFileIds: string[]) => void;
}

const FileUploadContext = React.createContext<FileUploadContextApi>({
    newlyUploadedFileIds: [],
    addNewlyUploadedFileIds: () => {
        console.warn("If you want to track newlyUploadedFileIds, FileUploadContextProvider has to be defined higher up in the tree");
    },
});

export const useFileUploadContext = () => React.useContext(FileUploadContext);

export const FileUploadContextProvider: React.FunctionComponent = ({ children }) => {
    const [newlyUploadedFileIds, setNewlyUploadedFileIds] = React.useState<string[]>([]);

    const addNewlyUploadedFileIds = (fileIds: string[]) => {
        setNewlyUploadedFileIds((newlyUploadedFileIds) => [...newlyUploadedFileIds, ...fileIds]);

        setTimeout(() => {
            // remove uploaded files automatically after 5 seconds
            setNewlyUploadedFileIds((newlyUploadedFileIds) => newlyUploadedFileIds.filter((fileId) => !fileIds.includes(fileId)));
        }, 5000);
    };

    return <FileUploadContext.Provider value={{ newlyUploadedFileIds, addNewlyUploadedFileIds }}>{children}</FileUploadContext.Provider>;
};
