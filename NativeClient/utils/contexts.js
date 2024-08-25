import { createContext } from "react";

export const ScrollingDownContext = createContext({
  scrollingDown: false,
});

export const AuthPromptModalContext = createContext(null);

export const IsAuthenticatedContext = createContext(false);
