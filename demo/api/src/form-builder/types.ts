import { BlockDataInterface } from "@comet/blocks-api";
import { Collection, Ref } from "@mikro-orm/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare abstract class FormBuilderInterface<Request extends FormRequestInterface<any>> {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    blocks: BlockDataInterface;
    requests: Collection<Request>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare abstract class FormRequestInterface<Form extends FormBuilderInterface<any>> {
    id: string;
    createdAt: Date;
    form: Ref<Form>;
    submitData: Record<string, unknown>;
}
