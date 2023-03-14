import React from "react";

export interface NewlyUploadedItem {
    id: string;
    parentId?: string;
    type: "file" | "folder";
}

interface FileUploadContextApi {
    newlyUploadedItemIds: NewlyUploadedItem[];
    addNewlyUploadedItemIds: (newlyUploadedItemIds: NewlyUploadedItem[]) => void;
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
    const [newlyUploadedItemIds, setNewlyUploadedItemIds] = React.useState<NewlyUploadedItem[]>([]);

    React.useEffect(() => {
        return () => {
            for (const timeout of timeouts.current) {
                clearTimeout(timeout);
            }
            setNewlyUploadedItemIds([]);
        };
    }, []);

    const addNewlyUploadedItemIds = (itemIds: NewlyUploadedItem[]) => {
        setNewlyUploadedItemIds((newlyUploadedItemIds) => [...itemIds, ...newlyUploadedItemIds]);

        const timeout = setTimeout(() => {
            // remove uploaded items automatically after 5 seconds
            setNewlyUploadedItemIds((newlyUploadedItemIds) => newlyUploadedItemIds.filter((itemId) => !itemIds.includes(itemId)));

            timeouts.current = timeouts.current.filter((t) => t !== timeout);
        }, 10000);

        timeouts.current.push(timeout);
    };

    return <FileUploadContext.Provider value={{ newlyUploadedItemIds, addNewlyUploadedItemIds }}>{children}</FileUploadContext.Provider>;
};
