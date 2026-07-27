import { createContext } from "react";

import type { TipTapTextBlockStyle } from "./createTipTapRichTextBlock";

export const TextBlockStyleContext = createContext<TipTapTextBlockStyle[]>([]);
