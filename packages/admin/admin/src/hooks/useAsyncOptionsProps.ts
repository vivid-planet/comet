import { type ChangeEvent, useEffect, useState } from "react";

export interface AsyncOptionsProps<T> {
    isAsync: boolean;
    open: boolean;
    options: T[];
    loadingError: Error | null;
    loading?: boolean;
    onOpen: (event: ChangeEvent) => void;
    onClose: (event: ChangeEvent) => void;
}
export function useAsyncOptionsProps<T>(loadOptions: () => Promise<T[]>): AsyncOptionsProps<T> {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        loadOptions()
            .then((newOptions) => {
                setOptions(newOptions);
            })
            .catch((e) => {
                setError(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [loadOptions]);
    const handleOpen = async () => {
        setOpen(true);
    };

    return {
        isAsync: true,
        open,
        loadingError: error,
        options,
        loading,
        onOpen: handleOpen,
        onClose: () => setOpen(false),
    };
}
