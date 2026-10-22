import {
    Tab as UiTab,
    TabList,
    type TabListProps,
    TabPanel,
    type TabPanelProps,
    type TabProps as UiTabProps,
    Tabs as UiTabs,
    type TabsProps as UiTabsProps,
} from "@dextinity/ui";
import { Children, isValidElement, type ReactElement, type ReactNode, useState } from "react";

export type TabsClassKey = "root" | "tabs" | "content" | "contentHidden";

interface TabProps {
    label: ReactNode;
    /** Keeps the content rendered while another tab is selected, for example to keep a form's entries. */
    forceRender?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

export const Tab = (props: TabProps) => null;

interface ITabsState {
    value: number;
    setValue: (value: number) => void;
}

type TabsChild = ReactElement<TabProps> | boolean | null | undefined;
type TabsChildren = TabsChild | Array<TabsChild | Array<TabsChild>>;

export interface TabsProps {
    children: TabsChildren;
    defaultIndex?: number;
    tabsState?: ITabsState;
    /** The accessible name of the tab list, for example "Product". */
    label?: string;
    className?: string;
    slotProps?: {
        root?: Partial<UiTabsProps>;
        tabs?: Partial<TabListProps>;
        tab?: Partial<UiTabProps>;
        content?: Partial<TabPanelProps>;
    };
}

export function Tabs({ children, defaultIndex, tabsState, label, className, slotProps }: TabsProps) {
    const uncontrolledState = useState(defaultIndex !== undefined ? defaultIndex : 0);
    const [value, setValue] = tabsState === undefined ? uncontrolledState : [tabsState.value, tabsState.setValue];

    const tabs = Children.toArray(children).filter((child): child is ReactElement<TabProps> => isValidElement(child));
    for (const tab of tabs) {
        if (tab.type !== Tab) {
            throw new Error("Tabs must contain only Tab children");
        }
    }

    return (
        <UiTabs value={value} onValueChange={(newValue) => setValue(newValue as number)} className={className} {...slotProps?.root}>
            <TabList {...tabListLabel(label)} {...slotProps?.tabs}>
                {tabs.map((tab, index) => (
                    <UiTab key={tab.key} value={index} icon={tab.props.icon} disabled={tab.props.disabled} {...slotProps?.tab}>
                        {tab.props.label}
                    </UiTab>
                ))}
            </TabList>
            {tabs.map((tab, index) => (
                <TabPanel key={tab.key} value={index} keepMounted={tab.props.forceRender} {...slotProps?.content}>
                    {tab.props.children}
                </TabPanel>
            ))}
        </UiTabs>
    );
}

/** `TabList` requires a label, but the admin's tabs never had one: without it, the tab list renders no `aria-label`. */
export const tabListLabel = (label: string | undefined) => ({ label }) as { label: string };
