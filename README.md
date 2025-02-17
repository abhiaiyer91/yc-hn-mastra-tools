# YC and HN Tools

A collection of Mastra tools for interacting with the Y Combinator API and Hacker News. This package provides tools to search, filter, and retrieve information about YC companies and Hacker News content.

## Tools

### YC API Tools

#### 1. Search Companies
Search for YC companies using various filters:
```typescript
const searchCompanies = createTool({
  id: 'Search YC Companies',
  inputSchema: {
    query?: string,    // Search query
    batch?: string,    // Batch identifier (e.g., 'W25')
    status?: string,   // Company status
    page?: number      // Page number for pagination
  }
});
```

#### 2. Get Company by Slug
Fetch a specific YC company by its slug:
```typescript
const getCompanyBySlug = createTool({
  id: 'Get YC Company by Slug',
  inputSchema: {
    slug: string       // Company slug identifier
  }
});
```

#### 3. List Companies by Batch
Get all companies from a specific YC batch:
```typescript
const listCompaniesByBatch = createTool({
  id: 'List YC Companies by Batch',
  inputSchema: {
    batch: string      // Batch identifier (e.g., 'W25')
  }
});
```

### Hacker News Tools

#### 1. Search Hacker News
Search for content across Hacker News:
```typescript
const searchHackerNews = createTool({
  id: 'Search Hacker News',
  inputSchema: {
    query: string,     // Search query
    page?: number,     // Page number (0-based)
    type?: 'story' | 'comment' | 'poll' | 'job' | 'pollopt'  // Content type
  }
});
```

#### 2. Get Top Stories
Fetch current top stories from Hacker News:
```typescript
const getTopStories = createTool({
  id: 'Get Top HN Stories',
  inputSchema: {
    page?: number,     // Page number (0-based)
    limit?: number     // Stories per page (max 100)
  }
});
```

## Installation

```bash
pnpm install
```

## Testing

The project includes a comprehensive test suite that verifies:
- YC company search and filtering
- HN content search and retrieval
- Rate limiting handling
- Cross-platform integrations (e.g., finding HN discussions about YC companies)

Run the tests with:
```bash
pnpm test
```

## Environment Variables

Create a `.env` file with:
```
OPENAI_API_KEY=your_api_key_here
```

## API Rate Limiting

Both the YC API and HN Algolia API include built-in rate limiting handling. If you encounter a 429 response, the tools will provide the recommended retry delay in seconds.

## Development

### Project Structure
```
src/
  ├── ycapi.ts         # YC API tools implementation
  ├── hnapi.ts         # Hacker News tools implementation
  ├── index.ts         # Package exports
  └── __tests__/       # Test files
```

### Adding New Tools

1. Define your tool using `createTool` from `@mastra/core/tools`
2. Add input validation using Zod schemas
3. Implement the execute function
4. Export the tool from index.ts
5. Add corresponding tests

## License

ISC
