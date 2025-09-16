import { useQuery } from "@tanstack/react-query";
import { getArweaveData } from "../lib/arweave";
import type { Tag } from "../types";
import { getCategoryByMimeType } from "../utils";

const useVideo = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const arweaveData = await getArweaveData(id!);
      const contentMimeType = arweaveData?.tags?.find(
        (tag: Tag) => tag.name == "Content-Type",
      );
      const contentCategory = getCategoryByMimeType(
        contentMimeType?.value || "",
      );

      if (contentCategory !== "video") {
        console.log("Not a video", id);
        throw new Error("Not a video");
      }

      return {
        url: `https://arweave.net/raw/${arweaveData.id}`,
        alt:
          arweaveData.tags.find((tag: Tag) => tag.name == "Name")?.value ||
          "arweave image",
      };
    },
  });

  return { data, isVideoLoading: isLoading, isVideoError: isError, error };
};

export default useVideo;
