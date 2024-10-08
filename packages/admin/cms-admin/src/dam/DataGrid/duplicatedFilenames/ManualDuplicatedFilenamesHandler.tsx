import { useApolloClient } from "@apollo/client";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

import { GQLFilenameResponse } from "../../../graphql.generated";
import { useDamScope } from "../../config/useDamScope";
import { damAreFilenamesOccupied } from "./ManualDuplicatedFilenamesHandler.gql";
import { GQLDamAreFilenamesOccupiedQuery, GQLDamAreFilenamesOccupiedQueryVariables } from "./ManualDuplicatedFilenamesHandler.gql.generated";
import { ManuallyHandleDuplicatedFilenamesDialog } from "./ManuallyHandleDuplicatedFilenamesDialog";

export interface ManualDuplicatedFilenamesHandlerApi {
    checkForDuplicates: (fileData: FilenameData[]) => Promise<GQLFilenameResponse[]>;
    letUserHandleDuplicates: (fileData: FilenameData[]) => Promise<FilenameData[]>;
}

export interface FilenameData {
    name: string;
    folderId?: string;
}

export const ManualDuplicatedFilenamesHandlerContext = createContext<ManualDuplicatedFilenamesHandlerApi | undefined>(undefined);

export const useManualDuplicatedFilenamesHandler = (): ManualDuplicatedFilenamesHandlerApi | undefined => {
    return useContext(ManualDuplicatedFilenamesHandlerContext);
};

export const ManualDuplicatedFilenamesHandlerContextProvider = ({ children }: { children?: ReactNode }) => {
    const client = useApolloClient();
    const scope = useDamScope();

    const [occupiedFilenames, setOccupiedFilenames] = useState<FilenameData[]>([]);
    const [unoccupiedFilenames, setUnoccupiedFilenames] = useState<FilenameData[]>([]);
    const [callback, setCallback] = useState<(newFilenames: FilenameData[]) => unknown>();

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
        async (fileData: FilenameData[]): Promise<FilenameData[]> => {
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
                return unoccupiedFilenames;
            }

            setOccupiedFilenames(occupiedFilenames);
            setUnoccupiedFilenames(unoccupiedFilenames);

            const finalFilenameData = await new Promise<FilenameData[]>((resolve) => {
                setCallback(() => (fileData: FilenameData[]) => resolve(fileData));
            });

            return finalFilenameData;
        },
        [checkForDuplicates],
    );

    const onSkip = () => {
        callback?.(unoccupiedFilenames);
        setOccupiedFilenames([]);
    };

    const onUpload = () => {
        callback?.([...unoccupiedFilenames, ...occupiedFilenames]);
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
            />
        </ManualDuplicatedFilenamesHandlerContext.Provider>
    );
};
