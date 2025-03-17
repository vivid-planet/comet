import { RouterMemoryRouter } from "@comet/admin";
import { action } from "@storybook/addon-actions";
import { type Decorator } from "@storybook/react";
import { type Action, type History, type UnregisterCallback } from "history";
import { type PropsWithChildren, type ReactNode, useEffect } from "react";
import { type MemoryRouterProps, Route, type RouteComponentProps } from "react-router";

const StoryRouter = ({ children, routerProps }: { children: ReactNode; routerProps?: MemoryRouterProps }) => {
    return (
        <RouterMemoryRouter {...routerProps}>
            <Route render={(props) => <HistoryWatcher {...props}>{children}</HistoryWatcher>} />
        </RouterMemoryRouter>
    );
};

function HistoryWatcher({ history, children }: PropsWithChildren<RouteComponentProps>) {
    useEffect(() => {
        const onHistoryChanged: History.LocationListener = (location, historyAction: Action) => {
            const path = location.pathname;
            action(historyAction ? historyAction : (location as any).action)(path);
        };
        const unlisten: UnregisterCallback = history.listen(onHistoryChanged);

        return () => {
            unlisten();
        };
    }, [history]);

    return <>{children}</>;
}

export function storyRouterDecorator(): Decorator {
    return (Story) => {
        return (
            <StoryRouter>
                <Story />
            </StoryRouter>
        );
    };
}
