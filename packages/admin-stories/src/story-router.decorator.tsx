import { RouterMemoryRouter } from "@comet/admin";
import { action } from "@storybook/addon-actions";
import { StoryContext, StoryFn } from "@storybook/addons";
import { Action, History, UnregisterCallback } from "history";
import * as React from "react";
import { MemoryRouterProps, Route, RouteComponentProps } from "react-router";

const StoryRouter = ({ children, routerProps }: { children: React.ReactNode; routerProps?: MemoryRouterProps }) => {
    return (
        <RouterMemoryRouter {...routerProps}>
            <Route render={(props) => <HistoryWatcher {...props}>{children}</HistoryWatcher>} />
        </RouterMemoryRouter>
    );
};

function HistoryWatcher({ history, children }: React.PropsWithChildren<RouteComponentProps>) {
    React.useEffect(() => {
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

export function storyRouterDecorator<StoryFnReturnType = unknown>() {
    return (fn: StoryFn<StoryFnReturnType>, c: StoryContext) => {
        // TODO: Fix this
        // @ts-ignore
        return <StoryRouter>{fn()}</StoryRouter>;
    };
}
