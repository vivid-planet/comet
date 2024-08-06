import { useErrorHandler } from "./ErrorHandlerProvider";

interface Props {
    error: Error;
}

export const ErrorReporter = ({ error }: Props) => {
    const { onError } = useErrorHandler();
    onError(error);

    return null;
};
