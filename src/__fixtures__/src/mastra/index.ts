import { Mastra } from "@mastra/core";
import { ycAgent } from "./agents";

export const mastra = new Mastra({
    agents: { ycAgent },
});