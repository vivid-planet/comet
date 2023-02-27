import { Module } from "@nestjs/common";

import { DocumentSubscriber } from "./document-subscriber";

@Module({
    imports: [],
    providers: [DocumentSubscriber],
})
export class DocumentSubscriberModule {}
