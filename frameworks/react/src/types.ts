export type TComponentProps = {
  id: string;
  className?: string;
};

export type Tag = {
  name: string;
  value: string;
};

export type TArweaveData = {
  url: string;
  tags: Array<Tag>;
};

export type TContentCategory =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "code"
  | "markdown"
  | "unknown";
