import React from "react";
import styled from "styled-components";

interface ClickAwayListenerProps {
    children: React.ReactNode;
    onClickAway: () => void;
}

export const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({ children, onClickAway }) => {
    const targetRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickAway = (event: MouseEvent) => {
            if (targetRef.current && !targetRef.current.contains(event.target as Node)) {
                onClickAway();
            }
        };

        document.addEventListener("click", handleClickAway);

        return () => {
            document.removeEventListener("click", handleClickAway);
        };
    }, [onClickAway]);

    return <Target ref={targetRef}>{children}</Target>;
};

const Target = styled.div`
    display: contents;
`;
