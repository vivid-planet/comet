import { RouterMemoryRouter } from "@comet/admin";
import { type Decorator } from "@storybook/react-webpack5";
import { type PropsWithChildren, type ReactNode, useEffect, useRef } from "react";
import { type MemoryRouterProps, useLocation, useNavigationType } from "react-router";
import { action } from "storybook/actions";

const StoryRouter = ({ children, routerProps }: { children: ReactNode; routerProps?: MemoryRouterProps }) => {
    return (
        <RouterMemoryRouter {...routerProps}>
            <HistoryWatcher>{children}</HistoryWatcher>
        </RouterMemoryRouter>
    );
};

function HistoryWatcher({ children }: PropsWithChildren) {
    const location = useLocation();
    const navigationType = useNavigationType();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        action(navigationType)(location.pathname);
    }, [location, navigationType]);

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
