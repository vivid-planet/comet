import { useEffect, useState } from "react";

export interface IWindowSize {
    width: number;
    height: number;
}

export const useWindowSize = (): IWindowSize => {
    const getSize = (): IWindowSize => ({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [windowSize, setWindowSize] = useState<IWindowSize>(getSize());

    useEffect(() => {
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
