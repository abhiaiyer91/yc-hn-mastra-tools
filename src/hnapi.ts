import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface HNHit {
  objectID: string;
  title: string;
  url: string;
  author: string;
  points: number;
  story_text: string | null;
  comment_text: string | null;
  created_at: string;
  created_at_i: number;
  num_comments: number;
  story_id: number | null;
  story_title: string | null;
  story_url: string | null;
  parent_id: number | null;
  _tags: string[];
}

interface HNSearchResponse {
  hits: HNHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
}

const ALGOLIA_API = {
  APP_ID: 'UJ5WYC0L7X',
  API_KEY: '28f0e1ec37a5e792e6845e67da5f20dd',
  INDEX: 'Item_dev',
};

async function searchHN(query: string, page: number = 0, type?: string): Promise<HNSearchResponse> {
  const url = `https://${ALGOLIA_API.APP_ID.toLowerCase()}-dsn.algolia.net/1/indexes/${ALGOLIA_API.INDEX}/query`;

  const searchParams = {
    query,
    analyticsTags: ['web'],
    page,
    hitsPerPage: 30,
    minWordSizefor1Typo: 4,
    minWordSizefor2Typos: 8,
    advancedSyntax: true,
    ignorePlurals: false,
    clickAnalytics: true,
    minProximity: 7,
    numericFilters: [],
    tagFilters: type ? [[type], []] : [['story'], []],
    typoTolerance: true,
    queryType: 'prefixNone',
    restrictSearchableAttributes: ['title', 'comment_text', 'url', 'story_text', 'author'],
    getRankingInfo: true
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Algolia-API-Key': ALGOLIA_API.API_KEY,
      'X-Algolia-Application-ID': ALGOLIA_API.APP_ID,
    },
    body: JSON.stringify(searchParams),
  });

  if (!response.ok) {
    throw new Error(`Algolia API request failed: ${response.statusText}`);
  }

  return response.json();
}

export const searchHackerNews = createTool({
  id: 'Search Hacker News',
  description: 'Search for stories and comments on Hacker News',
  inputSchema: z.object({
    query: z.string().describe('Search query'),
    page: z.number().optional().describe('Page number (0-based)'),
    type: z.enum(['story', 'comment', 'poll', 'job', 'pollopt']).optional()
      .describe('Type of content to search for'),
  }),
  execute: async ({ context, mastra }) => {
    mastra?.logger?.info('Searching Hacker News', { query: context.query, page: context.page, type: context.type });

    const results = await searchHN(
      context.query,
      context.page || 0,
      context.type
    );

    // Transform the response to be more user-friendly
    return {
      items: results.hits.map(hit => ({
        id: hit.objectID,
        title: hit.title || hit.story_title || '',
        url: hit.url || hit.story_url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        author: hit.author,
        points: hit.points,
        commentCount: hit.num_comments,
        createdAt: new Date(hit.created_at_i * 1000).toISOString(),
        text: hit.story_text || hit.comment_text || '',
        type: hit._tags.find(t => ['story', 'comment', 'poll', 'job', 'pollopt'].includes(t)) || 'unknown'
      })),
      totalHits: results.nbHits,
      currentPage: results.page,
      totalPages: results.nbPages,
      processingTime: results.processingTimeMS
    };
  },
});

export const getTopStories = createTool({
  id: 'Get Top HN Stories',
  description: 'Get the current top stories from Hacker News',
  inputSchema: z.object({
    page: z.number().optional().default(0).describe('Page number (0-based)'),
    limit: z.number().optional().default(30).describe('Number of stories per page (max 100)'),
  }),
  execute: async ({ context, mastra }) => {
    mastra?.logger?.info('Fetching top HN stories', { page: context.page, limit: context.limit });

    // For top stories, we want to sort by points in descending order
    const results = await searchHN(
      '',  // empty query to get all stories
      context.page || 0,
      'story'
    );

    return {
      stories: results.hits.map(hit => ({
        id: hit.objectID,
        title: hit.title,
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        author: hit.author,
        points: hit.points,
        commentCount: hit.num_comments,
        createdAt: new Date(hit.created_at_i * 1000).toISOString(),
      })),
      currentPage: results.page,
      totalPages: results.nbPages,
    };
  },
});
