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
    const timeouts = React.useRef<NodeJS.Timeout[]>([]);
    const [newlyUploadedFileIds, setNewlyUploadedFileIds] = React.useState<string[]>([]);

    React.useEffect(() => {
        return () => {
            for (const timeout of timeouts.current) {
                clearTimeout(timeout);
            }
        };
    }, []);

    const addNewlyUploadedFileIds = (fileIds: string[]) => {
        setNewlyUploadedFileIds((newlyUploadedFileIds) => [...newlyUploadedFileIds, ...fileIds]);

        const timeout = setTimeout(() => {
            // remove uploaded files automatically after 5 seconds
            setNewlyUploadedFileIds((newlyUploadedFileIds) => newlyUploadedFileIds.filter((fileId) => !fileIds.includes(fileId)));

            timeouts.current = timeouts.current.filter((t) => t !== timeout);
        }, 5000);

        timeouts.current.push(timeout);
    };

    return <FileUploadContext.Provider value={{ newlyUploadedFileIds, addNewlyUploadedFileIds }}>{children}</FileUploadContext.Provider>;
};
