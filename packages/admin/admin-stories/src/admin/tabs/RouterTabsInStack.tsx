import { RouterTab, RouterTabs, Stack, StackPage, StackSwitch } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

const mountCount: Record<string, number> = {};

function RenderCount(props: { name: string }) {
    React.useEffect(() => {
        mountCount[props.name] = (mountCount[props.name] || 0) + 1;
    }, [props.name]);
    const renderCount = React.useRef(0);
    renderCount.current++;
    return (
        <div>
            Render count {props.name}: {renderCount.current}
        </div>
    );
}

function PrintMountCount() {
    const [, rerender] = React.useState(0);
    React.useEffect(() => {
        const timer = setInterval(() => {
            rerender(new Date().getTime());
        }, 100);
        return () => clearInterval(timer);
    }, []);
    return <div>Mount count: {JSON.stringify(mountCount)}</div>;
}

function Story() {
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
}

storiesOf("@comet/admin/tabs", module)
    .addDecorator(storyRouterDecorator())
    .add("RouterTabs in Stack", () => <Story />);
