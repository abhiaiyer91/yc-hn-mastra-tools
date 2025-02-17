import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import * as tools from '../../../../ycapi';

export const ycAgent = new Agent<typeof tools>({
    name: 'YC Company Search Agent',
    instructions: `You are a helpful assistant that can search and provide information about Y Combinator companies.
You can:
- Search for companies using keywords
- Filter companies by batch (e.g., W25) or status
- Look up specific companies by their slug
- List all companies from a specific batch`,
    model: openai('gpt-4o-mini'),
    tools: {
        searchCompanies: tools.searchCompanies,
        getCompanyBySlug: tools.getCompanyBySlug,
        listCompaniesByBatch: tools.listCompaniesByBatch,
    },
});
