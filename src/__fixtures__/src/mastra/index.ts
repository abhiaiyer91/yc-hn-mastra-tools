import { Mastra } from '@mastra/core';
import { ycAgent } from './agents/index.js';

export const mastra = new Mastra({
    agents: { ycAgent },
});