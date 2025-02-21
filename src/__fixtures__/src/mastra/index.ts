import { Mastra } from '@mastra/core/mastra';
import { ycAgent } from './agents/index.js';

export const mastra: Mastra = new Mastra({
    agents: { ycAgent },
});