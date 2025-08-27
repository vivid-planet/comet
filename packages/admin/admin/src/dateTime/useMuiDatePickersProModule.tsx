import { type DateRangePickerProps, type PickersInputBaseClasses, type SingleInputDateRangeFieldProps } from "@mui/x-date-pickers-pro";
import { type ComponentType, useEffect, useState } from "react";

type Module = {
    DateRangePicker: ComponentType<DateRangePickerProps<Date, boolean>>;
    pickersInputBaseClasses: Record<keyof PickersInputBaseClasses, string>;
    SingleInputDateRangeField: ComponentType<SingleInputDateRangeFieldProps<Date, boolean>>;
};

let module: Module | null = null;
let modulePromise: Promise<Module> | null = null;

const importModule = async () => {
    if (module) {
        return module;
    }

    if (modulePromise) {
        return modulePromise;
    }

    modulePromise = (async () => {
        try {
            const { DateRangePicker, pickersInputBaseClasses, SingleInputDateRangeField } = await import("@mui/x-date-pickers-pro");
            module = {
                DateRangePicker,
                pickersInputBaseClasses,
                SingleInputDateRangeField,
            };
            return module;
        } catch {
            throw new Error("Failed to import '@mui/x-date-pickers-pro', make sure it's installed.");
        }
    })();

    return modulePromise;
};

type SuccessReturnValue = {
    error: null;
    loading: false;
    module: Module;
};

type ErrorReturnValue = {
    error: string;
    loading: false;
    module: null;
};

type LoadingReturnValue = {
    error: null;
    loading: true;
    module: null;
};

export const useMuiDatePickersProModule = (): SuccessReturnValue | ErrorReturnValue | LoadingReturnValue => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        importModule()
            .then(() => setLoaded(true))
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    if (loaded && module) {
        return {
            error: null,
            loading: false,
            module,
        };
    }

    if (error) {
        return {
            error,
            loading: false,
            module: null,
        };
    }

    return {
        error: null,
        loading: true,
        module: null,
    };
};
