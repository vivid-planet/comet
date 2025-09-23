import { ActionGridToolbar } from "@comet/cms-admin";
import { DataGrid, type GridSlotsComponent } from "@mui/x-data-grid";
import type { Meta, StoryFn } from "@storybook/react-webpack5";

type Story = StoryFn<typeof ActionGridToolbar>;
const config: Meta<typeof ActionGridToolbar> = {
    component: ActionGridToolbar,
    title: "@comet/cms-admin/Action log/Action log grid/Action grid toolbar/Action grid toolbar",
};
export default config;
const TemplateStory: Story = (props) => {
    const StoryComponent = () => {
        return (
            <DataGrid
                columns={[]}
                rows={[]}
                slotProps={{
                    toolbar: props,
                }}
                slots={{
                    toolbar: ActionGridToolbar as GridSlotsComponent["toolbar"],
                }}
            />
        );
    };

    return <StoryComponent />;
};

export const Default: Story = TemplateStory.bind({}) as Story;
export const DisabledCompare: Story = TemplateStory.bind({}) as Story;
DisabledCompare.args = {
    disableCompare: true,
};
