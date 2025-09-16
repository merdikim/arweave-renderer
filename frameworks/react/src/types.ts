export type TComponentProps = {
  id: string;
  className?: string;
};

export type Tag = {
  name: string;
  value: string;
};

export type TArweaveData = {
  id: string;
  tags: Array<Tag>;
};

export type TContentCategory =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "code"
  | "unknown";
