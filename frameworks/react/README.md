# Arweave Renderer - React Framework

This project provides a React-based framework for rendering content stored on [Arweave](https://www.arweave.org/). It enables seamless integration of Arweave data into React applications.

## Features

- Fetch and render Arweave transactions in React components
- Easy-to-use hooks and utilities
- Customizable rendering logic

## Installation

```bash
npm install arweave-renderer-react
```

## Usage

```jsx
import { Image, Video } from 'arweave-renderer-react';

function App() {
  return (
    <Image id={"your_image_id"}/>
    <Video id={"your_video_id"}/>
  );
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Open a pull request

## License

MIT
