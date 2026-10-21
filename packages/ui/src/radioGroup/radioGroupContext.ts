"use client";

import { createContext } from "react";

/**
 * Whether the enclosing `RadioGroup` is disabled, so each `Radio` can resolve its owner state.
 */
export const RadioGroupDisabledContext = createContext(false);
