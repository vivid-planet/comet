import type { SVGProps } from "react";

/*
 * Icons for the stories. An application brings its own icon set: the components accept any element as an icon.
 */

function StoryIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {children}
        </svg>
    );
}

export function AddIcon() {
    return (
        <StoryIcon>
            <path d="M12 5v14M5 12h14" />
        </StoryIcon>
    );
}

export function ArrowRightIcon() {
    return (
        <StoryIcon>
            <path d="M5 12h14M13 6l6 6-6 6" />
        </StoryIcon>
    );
}

export function DeleteIcon() {
    return (
        <StoryIcon>
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
        </StoryIcon>
    );
}

export function EditIcon() {
    return (
        <StoryIcon>
            <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />
        </StoryIcon>
    );
}

export function SearchIcon() {
    return (
        <StoryIcon>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </StoryIcon>
    );
}

export function SettingsIcon() {
    return (
        <StoryIcon>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
        </StoryIcon>
    );
}
