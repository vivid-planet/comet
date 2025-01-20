import { useStackApi } from "./Api";
import { useStackSwitchApi } from "./Switch";

export const useIsActiveStackSwitch = () => {
    const stackApi = useStackApi();
    const stackSwitchApi = useStackSwitchApi();

    if (stackApi && stackSwitchApi) {
        const currentSwitchIndex = stackSwitchApi.id ? stackApi.switches.findIndex((i) => i.id === stackSwitchApi.id) : -1;
        const nextSwitchShowsInitialPage = stackApi.switches[currentSwitchIndex + 1] && stackApi.switches[currentSwitchIndex + 1].isInitialPageActive;
        return currentSwitchIndex === stackApi.switches.length - (nextSwitchShowsInitialPage ? 2 : 1);
    }

    return true;
};
