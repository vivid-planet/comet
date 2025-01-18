import { createContext, useContext } from "react";

export const FieldNamesContext = createContext<string[]>([]);

export const useFieldNames = () => {
    const fieldNames = useContext(FieldNamesContext);

    return {
        fieldNames: [...new Set(fieldNames)],
        duplicateFieldNames: [...new Set(fieldNames.filter((fieldName, index) => fieldNames.indexOf(fieldName) !== index))],
    };
};
