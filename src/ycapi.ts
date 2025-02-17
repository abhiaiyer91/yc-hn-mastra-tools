import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface YCCompany {
  id: number;
  name: string;
  slug: string;
  website: string;
  smallLogoUrl: string;
  oneLiner: string;
  longDescription: string;
  teamSize: number;
  url: string;
  batch: string;
  tags: string[];
  status: string;
  industries: string[];
  regions: string[];
  locations: string[];
  badges: string[];
}

interface YCResponse {
  companies: YCCompany[];
  nextPage: string | null;
  prevPage: string | null;
  page: number;
  totalPages: number;
}

const BASE_URL = 'https://api.ycombinator.com/v0.1';

async function fetchYCCompanies(params: URLSearchParams): Promise<YCResponse> {
  const url = `${BASE_URL}/companies?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 429) {
      const data = await response.json();
      throw new Error(`Rate limit exceeded. Retry after ${data.retryAfterSeconds} seconds`);
    }
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export const searchCompanies = createTool({
  id: 'Search YC Companies',
  description: 'Search for YC companies using various filters',
  inputSchema: z.object({
    query: z.string().optional(),
    batch: z.string().optional(),
    status: z.string().optional(),
    page: z.number().optional(),
  }),
  execute: async ({ context, mastra }) => {

    mastra?.logger?.debug('Fetching YC companies');
    console.log(context);
    const params = new URLSearchParams();

    if (context.query) params.append('q', context.query);
    if (context.batch) params.append('batch', context.batch);
    if (context.status) params.append('status', context.status);
    if (context.page) params.append('page', context.page.toString());

    return await fetchYCCompanies(params);
  },
});

export const getCompanyBySlug = createTool({
  id: 'Get YC Company by Slug',
  description: 'Fetch a specific YC company by its slug',
  inputSchema: z.object({
    slug: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    mastra?.logger?.debug('Fetching YC companies');
    console.log(context);
    const params = new URLSearchParams();
    params.append('q', context.slug);
    const response = await fetchYCCompanies(params);
    return response.companies.find(company => company.slug === context.slug) || null;
  },
});

export const listCompaniesByBatch = createTool({
  id: 'List YC Companies by Batch',
  description: 'Get all companies from a specific YC batch',
  inputSchema: z.object({
    batch: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    mastra?.logger?.debug('Fetching YC companies by batch');
    console.log(context);
    const params = new URLSearchParams();
    params.append('batch', context.batch);
    const response = await fetchYCCompanies(params);
    return response.companies;
  },
});
