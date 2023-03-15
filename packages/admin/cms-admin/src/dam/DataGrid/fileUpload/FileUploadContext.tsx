import React from "react";

export interface NewlyUploadedItem {
    id: string;
    parentId?: string;
    type: "file" | "folder";
}

interface FileUploadContextApi {
    newlyUploadedItems: NewlyUploadedItem[];
    addNewlyUploadedItems: (newlyUploadedItems: NewlyUploadedItem[]) => void;
}

const FileUploadContext = React.createContext<FileUploadContextApi>({
    newlyUploadedItems: [],
    addNewlyUploadedItems: () => {
        console.warn("If you want to track newlyUploadedItems, FileUploadContextProvider has to be defined higher up in the tree");
    },
});

export const useFileUploadContext = () => React.useContext(FileUploadContext);

export const FileUploadContextProvider: React.FunctionComponent = ({ children }) => {
    const timeouts = React.useRef<NodeJS.Timeout[]>([]);
    const [newlyUploadedItems, setNewlyUploadedItems] = React.useState<NewlyUploadedItem[]>([]);

    React.useEffect(() => {
        return () => {
            for (const timeout of timeouts.current) {
                clearTimeout(timeout);
            }
            setNewlyUploadedItems([]);
        };
    }, []);

    const addNewlyUploadedItems = (items: NewlyUploadedItem[]) => {
        setNewlyUploadedItems((newlyUploadedItems) => [...items, ...newlyUploadedItems]);

        const timeout = setTimeout(() => {
            // remove uploaded items automatically after 5 seconds
            setNewlyUploadedItems((newlyUploadedItems) => newlyUploadedItems.filter((itemId) => !items.includes(itemId)));

            timeouts.current = timeouts.current.filter((t) => t !== timeout);
        }, 10000);

        timeouts.current.push(timeout);
    };

    return (
        <FileUploadContext.Provider value={{ newlyUploadedItems, addNewlyUploadedItems: addNewlyUploadedItems }}>
            {children}
        </FileUploadContext.Provider>
    );
};
