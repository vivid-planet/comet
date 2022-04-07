import { isEqual } from "date-fns";

import { DocumentInterface } from "./dto/document-interface";

export function validateNotModified(document: DocumentInterface, lastUpdatedAt: Date): void {
    // only allow to save the document if it has not been modified
    if (document?.updatedAt && !isEqual(document.updatedAt, lastUpdatedAt)) {
        throw Error("Conflict: Document has been modified.");
    }
}
