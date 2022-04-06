export interface SupportedBlocks {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (props: any) => React.ReactNode | undefined;
}
