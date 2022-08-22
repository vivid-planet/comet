import React from "react";

interface FileUploadContextApi {
    lastUploadedFileIds: string[];
    addLastUploadedFileIds: (lastUploadedFileIds: string[]) => void;
}

const FileUploadContext = React.createContext<FileUploadContextApi>({
    lastUploadedFileIds: [],
    addLastUploadedFileIds: () => {
        console.warn("If you want to track lastUploadedFileIds, FileUploadContextProvider has to be defined higher up in the tree");
    },
});

export const useFileUploadContext = () => React.useContext(FileUploadContext);

export const FileUploadContextProvider: React.FunctionComponent = ({ children }) => {
    const [lastUploadedFileIds, setLastUploadedFileIds] = React.useState<string[]>([]);

    const addLastUploadedFileIds = (fileIds: string[]) => {
        setLastUploadedFileIds((lastUploadedFileIds) => [...lastUploadedFileIds, ...fileIds]);

        setTimeout(() => {
            // remove uploaded files automatically after 5 seconds
            setLastUploadedFileIds((lastUploadedFileIds) => lastUploadedFileIds.filter((fileId) => !fileIds.includes(fileId)));
        }, 5000);
    };

    return <FileUploadContext.Provider value={{ lastUploadedFileIds, addLastUploadedFileIds }}>{children}</FileUploadContext.Provider>;
};
