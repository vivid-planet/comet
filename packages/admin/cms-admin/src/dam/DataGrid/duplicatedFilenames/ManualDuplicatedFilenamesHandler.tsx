import { useApolloClient } from "@apollo/client";
import { createContext, useCallback, useContext, useState } from "react";

import { GQLFilenameResponse } from "../../../graphql.generated";
import { useDamScope } from "../../config/useDamScope";
import { damAreFilenamesOccupied } from "./ManualDuplicatedFilenamesHandler.gql";
import { GQLDamAreFilenamesOccupiedQuery, GQLDamAreFilenamesOccupiedQueryVariables } from "./ManualDuplicatedFilenamesHandler.gql.generated";
import { ManuallyHandleDuplicatedFilenamesDialog } from "./ManuallyHandleDuplicatedFilenamesDialog";

export interface ManualDuplicatedFilenamesHandlerApi {
    checkForDuplicates: (fileData: FilenameData[]) => Promise<GQLFilenameResponse[]>;
    letUserHandleDuplicates: (fileData: FilenameData[]) => Promise<{ filenames: FilenameData[]; duplicateAction: DuplicateAction }>;
}

export interface FilenameData {
    name: string;
    folderId?: string;
}

export const ManualDuplicatedFilenamesHandlerContext = createContext<ManualDuplicatedFilenamesHandlerApi | undefined>(undefined);

export const useManualDuplicatedFilenamesHandler = (): ManualDuplicatedFilenamesHandlerApi | undefined => {
    return useContext(ManualDuplicatedFilenamesHandlerContext);
};

export type DuplicateAction = "replace" | "copy" | null;

export const ManualDuplicatedFilenamesHandlerContextProvider: React.FunctionComponent = ({ children }) => {
    const client = useApolloClient();
    const scope = useDamScope();

    const [occupiedFilenames, setOccupiedFilenames] = useState<FilenameData[]>([]);
    const [unoccupiedFilenames, setUnoccupiedFilenames] = useState<FilenameData[]>([]);
    const [callback, setCallback] =
        useState<({ newFilenames, duplicateAction }: { newFilenames: FilenameData[]; duplicateAction: DuplicateAction }) => unknown>();

    const checkForDuplicates = useCallback(
        async (filenameData: FilenameData[]) => {
            const { data } = await client.query<GQLDamAreFilenamesOccupiedQuery, GQLDamAreFilenamesOccupiedQueryVariables>({
                query: damAreFilenamesOccupied,
                variables: {
                    filenames: filenameData.map((file) => ({
                        name: file.name,
                        folderId: file.folderId,
                    })),
                    scope,
                },
                fetchPolicy: "network-only",
            });

            return data.filenamesResponse;
        },
        [client, scope],
    );

    const letUserHandleDuplicates = useCallback(
        async (fileData: FilenameData[]): Promise<{ filenames: FilenameData[]; duplicateAction: DuplicateAction }> => {
            const potentialDuplicates = await checkForDuplicates(fileData);

            const occupiedFilenames: FilenameData[] = [];
            const unoccupiedFilenames: FilenameData[] = [];

            for (const potentialDuplicate of potentialDuplicates) {
                const potentialDuplicateFilenameData = { ...potentialDuplicate, folderId: potentialDuplicate.folderId ?? undefined };
                if (potentialDuplicate.isOccupied) {
                    occupiedFilenames.push(potentialDuplicateFilenameData);
                } else {
                    unoccupiedFilenames.push(potentialDuplicateFilenameData);
                }
            }

            if (occupiedFilenames.length === 0) {
                return { filenames: unoccupiedFilenames, duplicateAction: null };
            }

            setOccupiedFilenames(occupiedFilenames);
            setUnoccupiedFilenames(unoccupiedFilenames);

            const { newFilenames: finalFilenameData, duplicateAction } = await new Promise<{
                newFilenames: FilenameData[];
                duplicateAction: "replace" | "copy" | null;
            }>((resolve) => {
                setCallback(() => (data: { newFilenames: FilenameData[]; duplicateAction: "replace" | "copy" | null }) => resolve(data));
            });

            return { filenames: finalFilenameData, duplicateAction };
        },
        [checkForDuplicates],
    );

    const onSkip = () => {
        callback?.({ newFilenames: unoccupiedFilenames, duplicateAction: null });
        setOccupiedFilenames([]);
    };

    const onUpload = () => {
        callback?.({ newFilenames: [...unoccupiedFilenames, ...occupiedFilenames], duplicateAction: "copy" });
        setOccupiedFilenames([]);
    };

    const onReplace = () => {
        callback?.({ newFilenames: [...unoccupiedFilenames, ...occupiedFilenames], duplicateAction: "replace" });
        setOccupiedFilenames([]);
    };

    return (
        <ManualDuplicatedFilenamesHandlerContext.Provider
            value={{
                checkForDuplicates,
                letUserHandleDuplicates,
            }}
        >
            {children}
            <ManuallyHandleDuplicatedFilenamesDialog
                open={occupiedFilenames.length > 0}
                filenameData={occupiedFilenames}
                onSkip={onSkip}
                onUpload={onUpload}
                onReplace={onReplace}
            />
        </ManualDuplicatedFilenamesHandlerContext.Provider>
    );
};
