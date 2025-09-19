export type Tag = {
  name: string;
  value: string;
};

export type TMedia = {
  url: string;
  tags: Array<Tag>;
};

export type TImage = {
  src: string;
  alt: string;
};

export type TVideo = {
  src: string;
  name: string;
};

export type TMarkDown = {
  name: string;
  text: string;
};

export type TContentCategory =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "code"
  | "markdown"
  | "unknown";
