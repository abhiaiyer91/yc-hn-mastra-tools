# YC Tools

A collection of Mastra tools for interacting with the Y Combinator API. This package provides tools to search, filter, and retrieve information about YC companies.

## Tools

### 1. Search Companies
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

### 2. Get Company by Slug
Fetch a specific YC company by its slug:
```typescript
const getCompanyBySlug = createTool({
  id: 'Get YC Company by Slug',
  inputSchema: {
    slug: string       // Company slug identifier
  }
});
```

### 3. List Companies by Batch
Get all companies from a specific YC batch:
```typescript
const listCompaniesByBatch = createTool({
  id: 'List YC Companies by Batch',
  inputSchema: {
    batch: string      // Batch identifier (e.g., 'W25')
  }
});
```

## Installation

```bash
pnpm install
```

## Testing

The project includes a comprehensive test suite that verifies:
- Company search functionality
- Slug-based company retrieval
- Batch-based company listing
- Rate limiting handling

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

The tools include built-in handling for YC API rate limiting. If you encounter a 429 response, the tool will provide the recommended retry delay in seconds.

## Development

### Project Structure
```
src/
  ├── ycapi.ts         # Main tools implementation
  ├── index.ts         # Package exports
  └── __tests__/       # Test files
```

### Adding New Tools

1. Define your tool using `createTool` from `@mastra/core/tools`
2. Add input validation using Zod schemas
3. Implement the execute function
4. Export the tool from index.ts

## License

ISC
