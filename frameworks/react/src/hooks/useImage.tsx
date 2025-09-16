import { useQuery } from "@tanstack/react-query";
import { getArweaveData } from "../lib/arweave";
import type { Tag } from "../types";
import { getCategoryByMimeType } from "../utils";

const useImage = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["image", id],
    queryFn: async () => {
      const arweaveData = await getArweaveData(id!);
      const contentMimeType = arweaveData?.tags?.find(
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
        url: `https://arweave.net/raw/${arweaveData.id}`,
        alt:
          arweaveData.tags.find((tag: Tag) => tag.name == "Name")?.value ||
          "arweave image",
      };
    },
  });

  return { data, isImageLoading: isLoading, isImageError: isError, error };
};

export default useImage;
