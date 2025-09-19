import { useQuery } from "@tanstack/react-query";
import type { Tag, TImage } from "@/types";
import { getCategoryByMimeType } from "@/utils";
import { requestMedia } from "@/lib/wayfinder";

const useImage = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["image", id],
    queryFn: async (): Promise<TImage> => {
      const result = await requestMedia(id || "");

      const contentMimeType = result?.tags?.find(
        (tag: Tag) => tag.name == "Content-Type",
      );
      const contentCategory = getCategoryByMimeType(
        contentMimeType?.value || "",
      );

      if (contentCategory !== "image") {
        console.log("Not an image", id);
        throw new Error("Not an image");
      }

      return {
        src: result.url,
        alt:
          result.tags.find((tag: Tag) => tag.name == "Name")?.value ||
          "arweave image",
      };
    },
  });

  return {
    image: data,
    isImageLoading: isLoading,
    isImageError: isError,
    error,
  };
};

export default useImage;
