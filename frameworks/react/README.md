# Arweave Renderer React

## Overview

Arweave Renderer React is a set of react hooks that enable seamless integration of Arweave-stored content into React applications. It provides hooks to fetch data stored on Arweave.

## Features

- Fetch and render Arweave transactions in React
- Support for images and videos
- Easy-to-use React hooks
- TypeScript support

## Installation

```bash
npm install @arweave-renderer-react
```

## Usage

Image hook

```jsx
import { useImage } from "@arweave-renderer-react";

function App() {
  const { data, isImageLoading, isImageError, error } = useImage(arweave_id);

  return (
    <div>
      <div>display data here</div>
    </div>
  );
}
```

Video hook

```jsx
import { useVideo } from "@arweave-renderer-react";

function App() {
  const { data, isVideoLoading, isVideoError, error } = useVideo(arweave_id);

  return (
    <div>
      <div>display data here</div>
    </div>
  );
}
```

## API

Renders content from a given Arweave transaction.

**Params:**

- `arweave_id` (string): The Arweave transaction ID (Required)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Open a pull request

## License

MIT
