function objectScan(): () => string[] {
    return () => {
        return ["blocks[0].props.targetPageId", "blocks[1].props.targetPageId", "blocks[2].props.targetPageId"];
    };
}

export default objectScan;
