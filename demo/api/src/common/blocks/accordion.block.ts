import { createListBlock } from "@comet/cms-api";
import { AccordionItemBlock } from "@src/common/blocks/accordion-item.block";

export const AccordionBlock = createListBlock({ block: AccordionItemBlock }, "Accordion");
