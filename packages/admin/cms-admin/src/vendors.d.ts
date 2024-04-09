/// <reference types="@comet/admin-theme" />

interface CustomInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    webkitdirectory?: string;
    directory?: string;
}

declare namespace JSX {
    interface IntrinsicElements {
        input: CustomInputProps;
    }
}
