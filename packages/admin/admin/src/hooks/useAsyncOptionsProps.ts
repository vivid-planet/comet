import { type ChangeEvent, useState } from "react";

export interface AsyncOptionsProps<T> {
    isAsync: boolean;
    open: boolean;
    options: T[];
    loading?: boolean;
    onOpen: (event: ChangeEvent) => void;
    onClose: (event: ChangeEvent) => void;
}
export function useAsyncOptionsProps<T>(loadOptions: () => Promise<T[]>): AsyncOptionsProps<T> {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);

    const handleOpen = async () => {
        setOpen(true);
        setLoading(true);
        const newOptions = await loadOptions();
        setOptions(newOptions);
        setLoading(false);
    };

    return {
        isAsync: true,
        open,
        options,
        loading,
        onOpen: handleOpen,
        onClose: () => setOpen(false),
    };
}
