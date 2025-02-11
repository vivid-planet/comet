/// <reference types="@comet/admin-theme" />

// eslint-disable-next-line no-restricted-globals
interface CustomInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    webkitdirectory?: string;
    directory?: string;
}

declare namespace JSX {
    interface IntrinsicElements {
        input: CustomInputProps;
    }
}
