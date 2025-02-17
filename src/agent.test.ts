import { describe, it, expect } from 'vitest';
import { mastra } from './__fixtures__/src/mastra/index';

describe('YC Agent', () => {
  const agent = mastra.getAgent('ycAgent');

  it('should search for AI companies in W25 batch', async () => {
    const response = await agent.generate('Find AI companies from the W25 batch');
    expect(response.text).toBeTruthy();

    // We expect the agent to have used the searchCompanies tool
    const toolCalls = response.toolCalls;
    expect(toolCalls).toHaveLength(1);
    expect(toolCalls[0].tool.id).toBe('Search YC Companies');
    expect(toolCalls[0].input).toEqual({
      query: 'AI',
      batch: 'W25'
    });
  });

  it('should get company details by slug', async () => {
    const response = await agent.generate('Tell me about the company with slug "healthkey"');
    expect(response.text).toBeTruthy();

    // We expect the agent to have used the getCompanyBySlug tool
    const toolCalls = response.toolCalls;
    expect(toolCalls).toHaveLength(1);
    expect(toolCalls[0].tool.id).toBe('Get YC Company by Slug');
    expect(toolCalls[0].input).toEqual({
      slug: 'healthkey'
    });
  });

  it('should list all companies from a specific batch', async () => {
    const response = await agent.generate('List all companies from the W25 batch');
    expect(response.text).toBeTruthy();

    // We expect the agent to have used the listCompaniesByBatch tool
    const toolCalls = response.toolCalls;
    expect(toolCalls).toHaveLength(1);
    expect(toolCalls[0].tool.id).toBe('List YC Companies by Batch');
    expect(toolCalls[0].input).toEqual({
      batch: 'W25'
    });
  });

  it('should handle rate limiting errors gracefully', async () => {
    // Make multiple requests in quick succession to trigger rate limiting
    const promises = Array(5).fill(null).map(() =>
      agent.generate('Find AI companies from the W25 batch')
    );

    const results = await Promise.allSettled(promises);

    // At least one request should succeed
    expect(results.some(r => r.status === 'fulfilled')).toBe(true);

    // Some requests might be rejected due to rate limiting
    const rejectedResults = results.filter(r => r.status === 'rejected');
    if (rejectedResults.length > 0) {
      expect(rejectedResults[0].reason.message).toMatch(/Rate limit exceeded/);
    }
  });
});
