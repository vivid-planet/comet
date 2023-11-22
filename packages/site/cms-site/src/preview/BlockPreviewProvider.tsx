import * as React from "react";

import { PreviewContext } from "./PreviewContext";

export const BlockPreviewProvider: React.FunctionComponent = ({ children }) => {
    return (
        <PreviewContext.Provider
            value={{
                previewType: "BlockPreview",
                showPreviewSkeletons: true,
            }}
        >
            {children}
        </PreviewContext.Provider>
    );
};
