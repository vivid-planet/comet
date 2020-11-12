import * as React from "react";

export interface IWindowSize {
    width: number;
    height: number;
}

const useWindowSize = (): IWindowSize => {
    const getSize = (): IWindowSize => ({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [windowSize, setWindowSize] = React.useState<IWindowSize>(getSize());

    React.useEffect(() => {
        const handleResize = () => {
            setWindowSize(getSize());
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return windowSize;
};

export default useWindowSize;
