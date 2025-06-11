# API Documentation

This project includes interactive Swagger/OpenAPI documentation for all API endpoints.

## Accessing the Documentation

Once the development server is running, you can access the interactive API documentation at:

```
http://localhost:3000/api/docs
```

## Available Endpoints

### GET /api/random-word

Returns a random word from the impostor words database.

**Response Format:**
- **Success (200):** `{ "word": "example" }`
- **Error (500):** `{ "error": "error message" }`

## Features

- **Interactive Testing:** Use the "Try it out" button in the Swagger UI to test endpoints directly
- **Schema Documentation:** Complete request/response schema documentation
- **Type Safety:** All endpoints are documented with TypeScript types
- **Auto-generated:** Documentation is maintained alongside code changes

## Files Structure

```
src/app/api/
├── docs/
│   ├── route.ts          # Swagger UI serving endpoint
│   └── swagger.json      # OpenAPI specification
└── random-word/
    ├── route.ts          # API endpoint with JSDoc annotations
    └── actions.ts        # Database functions
```

## Adding New Endpoints

When adding new API endpoints:

1. Add the endpoint definition to `src/app/api/docs/swagger.json`
2. Add JSDoc comments to your route handler with `@swagger` annotations
3. Create corresponding TypeScript types in `src/types/api.ts`
4. The documentation will be automatically available in the Swagger UI

## Type Definitions

API response types are defined in `src/types/api.ts` for consistent typing across the application.
