import { RouterTab, RouterTabs, Stack, StackPage, StackSwitch } from "@comet/admin";
import { useEffect, useRef, useState } from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

const mountCount: Record<string, number> = {};

function RenderCount(props: { name: string }) {
    useEffect(() => {
        mountCount[props.name] = (mountCount[props.name] || 0) + 1;
    }, [props.name]);
    const renderCount = useRef(0);
    renderCount.current++;
    return (
        <div>
            Render count {props.name}: {renderCount.current}
        </div>
    );
}

function PrintMountCount() {
    const [, rerender] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            rerender(new Date().getTime());
        }, 100);
        return () => clearInterval(timer);
    }, []);
    return <div>Mount count: {JSON.stringify(mountCount)}</div>;
}

export default {
    title: "@comet/admin/tabs",
    decorators: [storyRouterDecorator()],
};

export const RouterTabsInStack = {
    render: () => {
        return (
            <Stack topLevelTitle="Nested Stack">
                <PrintMountCount />
                <StackSwitch>
                    <StackPage name="xxx">
                        <RenderCount name="StackPage" />
                        <RouterTabs>
                            <RouterTab label="Foo" path="" forceRender={true}>
                                Foo
                                <RenderCount name="Foo" />
                            </RouterTab>
                            <RouterTab label="Bar" path="/bar" forceRender={true}>
                                Bar
                                <RenderCount name="Bar" />
                            </RouterTab>
                        </RouterTabs>
                    </StackPage>
                    <StackPage name="yyy">yyy</StackPage>
                </StackSwitch>
            </Stack>
        );
    },

    name: "RouterTabs in Stack",
};
