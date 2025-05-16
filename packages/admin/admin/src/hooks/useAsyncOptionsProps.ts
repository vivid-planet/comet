import { type ChangeEvent, useState } from "react";

export interface AsyncOptionsProps<T> {
    isAsync: boolean;
    open: boolean;
    options: T[];
    error: boolean;
    loading?: boolean;
    onOpen: (event: ChangeEvent) => void;
    onClose: (event: ChangeEvent) => void;
}
export function useAsyncOptionsProps<T>(loadOptions: () => Promise<T[]>): AsyncOptionsProps<T> {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleOpen = async () => {
        setOpen(true);
        setLoading(true);
        setOptions([]); // Reset options to show loading
        try {
            const options = await loadOptions();
            setOptions(options);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    return {
        isAsync: true,
        open,
        error: error !== null,
        options,
        loading,
        onOpen: handleOpen,
        onClose: () => setOpen(false),
    };
}
