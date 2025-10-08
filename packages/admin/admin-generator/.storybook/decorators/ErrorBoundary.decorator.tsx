import { ErrorBoundary } from "@comet/admin";

export function ErrorBoundaryDecorator(fn) {
    return <ErrorBoundary>{fn()}</ErrorBoundary>;
}
