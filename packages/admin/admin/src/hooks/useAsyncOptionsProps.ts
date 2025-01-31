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
    const loading = open && options.length === 0;

    const handleOpen = async () => {
        setOpen(true);
        setOptions([]); // Reset options to show loading
        setOptions(await loadOptions());
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
