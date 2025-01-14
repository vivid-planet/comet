export const createShouldForwardPropBlockList = (blockList: PropertyKey[]) => {
    return (prop: PropertyKey) => {
        return !blockList.includes(prop);
    };
};
