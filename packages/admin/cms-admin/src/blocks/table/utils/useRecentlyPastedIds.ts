import { useCallback, useEffect, useRef, useState } from "react";

const recentlyPastedDurationMs = 5_000;

export const useRecentlyPastedIds = () => {
    const [recentlyPastedIds, setRecentlyPastedIds] = useState<string[]>([]);
    const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

    useEffect(() => {
        const timeouts = timeoutsRef.current;
        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout));
        };
    }, []);

    const addToRecentlyPastedIds = useCallback((id: string) => {
        setRecentlyPastedIds((prev) => [...prev, id]);

        const timeoutId = setTimeout(() => {
            setRecentlyPastedIds((prev) => prev.filter((prevId) => prevId !== id));
            timeoutsRef.current.delete(timeoutId);
        }, recentlyPastedDurationMs);

        timeoutsRef.current.add(timeoutId);
    }, []);

    return {
        recentlyPastedIds,
        addToRecentlyPastedIds,
    };
};
