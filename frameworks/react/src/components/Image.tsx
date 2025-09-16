import type { ReactNode } from "react";
import useImage from "../hooks/useImage";
import { cn } from "../lib/utils";
import type { TComponentProps } from "../types";
import { Loader, TriangleAlert } from "lucide-react";

const Image = ({ id, className }: TComponentProps) => {
  const { data, isImageLoading, isImageError, error } = useImage(id);

  if (isImageLoading) {
    return (
      <ImageWrapper className={className}>
        <Loader className="animate-spin m-2" />
      </ImageWrapper>
    );
  }

  if (isImageError) {
    return (
      <ImageWrapper className={className}>
        <div className="flex flex-col items-center justify-center m-2">
          <TriangleAlert />
          {error?.message}
        </div>
      </ImageWrapper>
    );
  }

  return (
    <ImageWrapper className={className}>
      <img
        src={data?.url}
        alt={data?.alt}
        className="object-cover h-full w-full"
      />
    </ImageWrapper>
  );
};

const ImageWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string | undefined;
}) => {
  return (
    <div
      className={cn(
        className,
        "min-h-5 min-w-5 flex items-center justify-center border text-black border-gray-200 rounded-sm dark:text-white dark:border-gray-900 overflow-hidden",
      )}
    >
      {children}
    </div>
  );
};

export default Image;
