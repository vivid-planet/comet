import * as React from "react";

export interface AsyncOptionsProps<T> {
    isAsync: boolean;
    open: boolean;
    options: T[];
    loading?: boolean;
    onOpen: (event: React.ChangeEvent<{}>) => void;
    onClose: (event: React.ChangeEvent<{}>) => void;
}
export function useAsyncOptionsProps<T>(loadOptions: () => Promise<T[]>): AsyncOptionsProps<T> {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<T[]>([]);
    const loading = open && options.length === 0;
    React.useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        (async () => {
            const response = await loadOptions();
            if (active) {
                setOptions(response);
            }
        })();
        return () => {
            active = false;
        };
    }, [loadOptions, loading]);
    return {
        isAsync: true,
        open,
        options,
        loading,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
    };
}
