import React from "react";

interface DamMultiselectItem {
    id: string;
    type: "file" | "folder";
}

type DamMultiselectSelectedState = "all_selected" | "some_selected" | "nothing_selected";

interface DamMultiselectApi {
    selectedState: DamMultiselectSelectedState;
    selectedItems: DamMultiselectItem[];
    select: (item: DamMultiselectItem) => void;
    unselect: (itemId: string) => void;
    unselectAll: () => void;
    isSelected: (itemId: string) => boolean;
}

export const DamMultiselectContext = React.createContext<DamMultiselectApi>({
    selectedState: "nothing_selected",
    selectedItems: [],
    select: () => {
        throw new Error("DamMultiselectContext.Provider has to be defined higher up in the tree");
    },
    unselect: () => {
        throw new Error("DamMultiselectContext.Provider has to be defined higher up in the tree");
    },
    unselectAll: () => {
        throw new Error("DamMultiselectContext.Provider has to be defined higher up in the tree");
    },
    isSelected: () => {
        throw new Error("DamMultiselectContext.Provider has to be defined higher up in the tree");
    },
});

export const useDamMultiselectApi = (): DamMultiselectApi => {
    return React.useContext(DamMultiselectContext);
};

interface UseDamMultiselectProps {
    totalItemCount?: number;
}
export const useDamMultiselect = ({ totalItemCount = 0 }: UseDamMultiselectProps): DamMultiselectApi => {
    const [selectedItems, setSelectedItems] = React.useState<DamMultiselectItem[]>([]);

    const select = (asset: DamMultiselectItem) => {
        setSelectedItems((assets) => [...assets, asset]);
    };

    const unselect = (id: string) => {
        setSelectedItems((selectedAssets) => selectedAssets.filter((selectedAsset) => selectedAsset.id !== id));
    };

    const unselectAll = () => {
        setSelectedItems([]);
    };

    const isSelected = (id: string): boolean => {
        return !!selectedItems.find((asset) => asset.id === id);
    };

    return { selectedState: resolveSelectedState(selectedItems.length, totalItemCount), selectedItems, select, unselect, unselectAll, isSelected };
};

const resolveSelectedState = (checkedCount: number, totalCount: number): DamMultiselectSelectedState => {
    if (checkedCount > 0 && checkedCount >= totalCount) {
        return "all_selected";
    } else if (checkedCount > 0) {
        return "some_selected";
    } else {
        return "nothing_selected";
    }
};
