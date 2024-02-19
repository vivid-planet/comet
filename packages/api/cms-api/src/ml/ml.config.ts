import { MlRequest, ModelType } from "./ml.types";

export interface MlConfig {
    models: {
        [key in ModelType]?: (request: MlRequest) => Promise<string>;
    };
}
