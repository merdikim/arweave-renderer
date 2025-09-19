```markdown
# Arweave Renderer React

This library provides React hooks for fetching arweave data(images, markdown, and videos) using React Query. All hooks follow a similar pattern and integrate with Arweave through the wayfinder library.

## Common Features

- **React Query Integration**: All hooks use `@tanstack/react-query` for caching, background updates, and error handling
- **Type Safety**: Full TypeScript support with proper type definitions
- **MIME Type Validation**: Content type validation to ensure the requested media matches the expected format
- **Arweave Integration**: Fetches media from Arweave using the wayfinder library
- **Consistent Error Handling**: Throws descriptive errors when content type doesn't match expectations 

## Installation

```bash
# Install the required peer dependencies
npm i arweave-renderer-react
``` 


```bash
# Install the required peer dependencies
npm install @tanstack/react-query
``` 

## Setup

Make sure to wrap your app with the React Query provider:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  )
}
```


## Hooks

### `useImage`

Fetches and validates image content from Arweave.

```typescript
const { image, isImageLoading, isImageError, error} = useImage(id)
```

**Parameters:**
- `id` (string | undefined): The Arweave transaction ID of the image

**Returns:**
```typescript
{
  image: TImage | undefined,      // Image data with src and alt properties
  isImageLoading: boolean,        // Loading state
  isImageError: boolean,          // Error state
  error: Error | null             // Error object if request failed
}
```

**TImage Type:**
```typescript
{
  src: string,     // Image URL
  alt: string      // Alt text (from the tag or default "arweave image")
}
```

**Behavior:**
- Validates that the content is an image using MIME type
- Extracts alt text from the tags in metadata
- Throws "Not an image" error if content type validation fails

### `useMarkDown`

Fetches and validates markdown content from Arweave.

```typescript
const { markDown, isMarkDownLoading, isMarkDownError, error} = useMarkDown(id)
```

**Parameters:**
- `id` (string | undefined): The Arweave transaction ID of the markdown content

**Returns:**
```typescript
{
  markDown: TMarkDown | undefined,    // Markdown data with text and name properties
  isMarkDownLoading: boolean,         // Loading state
  isMarkDownError: boolean,           // Error state
  error: Error | null                 // Error object if request failed
}
```

**TMarkDown Type:**
```typescript
{
  text: string,    // Raw markdown content
  name: string     // Content name (from the tag or default "markdown")
}
```

**Behavior:**
- Validates that the content is markdown using MIME type
- Fetches the actual text content
- Extracts name from the tags in metadata
- Throws "Not markdown" error if content type validation fails

### `useVideo`

Fetches and validates video content from Arweave.

```typescript
const { video, isVideoLoading, isVideoError, error} = useVideo(id)
```

**Parameters:**
- `id` (string | undefined): The Arweave transaction ID of the video

**Returns:**
```typescript
{
  video: TVideo | undefined,      // Video data with src and name properties
  isVideoLoading: boolean,        // Loading state
  isVideoError: boolean,          // Error state
  error: Error | null             // Error object if request failed
}
```

**TVideo Type:**
```typescript
{
  src: string,     // Video URL
  name: string     // Video name (from the tag or default "arweave video")
}
```

**Behavior:**
- Validates that the content is a video using MIME type
- Extracts name the tags in metadata
- Throws "Not a video" error if content type validation fails

## Dependencies

- `@tanstack/react-query`: this dependancy is required. Configure it in your project before using `arweave-renderer-react`


## Error Handling

All hooks will throw errors in the following scenarios:
- Network failures during media request
- Content type mismatch (e.g., requesting an image but getting a video)
- Invalid or missing transaction IDs

The React Query error boundary will catch these errors, and they can be handled through the returned `error` object and `isError` boolean.
```