import * as React from "react";

const useErrorBoundary = () => {
    const [, setState] = React.useState(false);
    const throwException = React.useCallback((e: Error) => {
        setState(() => {
            throw e;
        });
    }, []);
    return { throwException };
};

export { useErrorBoundary };
