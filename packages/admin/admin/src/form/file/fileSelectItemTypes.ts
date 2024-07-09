import { ReactNode } from "react";

export type ValidFileSelectItem<AdditionalFileValues = Record<string, unknown>> = {
    name: string;
    size: number;
    downloading?: boolean;
} & AdditionalFileValues;

export type ErrorFileSelectItem = {
    name?: string;
    error: true | ReactNode;
};

export type LoadingFileSelectItem = {
    name?: string;
    loading: true;
};

export type FileSelectItem<AdditionalValidFileValues = Record<string, unknown>> =
    | ValidFileSelectItem<AdditionalValidFileValues>
    | ErrorFileSelectItem
    | LoadingFileSelectItem;
