export interface CrudGeneratorConfig {
    target: string;
    entityName: string;
    rootBlocks?: {
        [key: string]: {
            name: string;
            import: string;
        };
    };
}
