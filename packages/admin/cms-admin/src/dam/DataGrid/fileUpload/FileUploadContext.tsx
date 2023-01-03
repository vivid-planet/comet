import React from "react";

interface FileUploadContextApi {
    newlyUploadedItemIds: Array<{ id: string; type: "file" | "folder" }>;
    addNewlyUploadedItemIds: (newlyUploadedItemIds: Array<{ id: string; type: "file" | "folder" }>) => void;
}

const FileUploadContext = React.createContext<FileUploadContextApi>({
    newlyUploadedItemIds: [],
    addNewlyUploadedItemIds: () => {
        console.warn("If you want to track newlyUploadedItemIds, FileUploadContextProvider has to be defined higher up in the tree");
    },
});

export const useFileUploadContext = () => React.useContext(FileUploadContext);

export const FileUploadContextProvider: React.FunctionComponent = ({ children }) => {
    const timeouts = React.useRef<NodeJS.Timeout[]>([]);
    const [newlyUploadedItemIds, setNewlyUploadedItemIds] = React.useState<Array<{ id: string; type: "file" | "folder" }>>([]);

    React.useEffect(() => {
        return () => {
            for (const timeout of timeouts.current) {
                clearTimeout(timeout);
            }
            setNewlyUploadedItemIds([]);
        };
    }, []);

    const addNewlyUploadedItemIds = (itemIds: Array<{ id: string; type: "file" | "folder" }>) => {
        setNewlyUploadedItemIds((newlyUploadedItemIds) => [...newlyUploadedItemIds, ...itemIds]);

        const timeout = setTimeout(() => {
            // remove uploaded items automatically after 5 seconds
            setNewlyUploadedItemIds((newlyUploadedItemIds) => newlyUploadedItemIds.filter((itemId) => !itemIds.includes(itemId)));

            timeouts.current = timeouts.current.filter((t) => t !== timeout);
        }, 5000);

        timeouts.current.push(timeout);
    };

    return <FileUploadContext.Provider value={{ newlyUploadedItemIds, addNewlyUploadedItemIds }}>{children}</FileUploadContext.Provider>;
};
