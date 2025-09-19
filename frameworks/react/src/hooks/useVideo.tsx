import { useQuery } from "@tanstack/react-query";
import type { Tag, TVideo } from "@/types";
import { getCategoryByMimeType } from "@/utils";
import { requestMedia } from "@/lib/wayfinder";

const useVideo = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["video", id],
    queryFn: async (): Promise<TVideo> => {
      const result = await requestMedia(id || "");
      const contentMimeType = result?.tags?.find(
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
        src: result.url,
        name:
          result.tags.find((tag: Tag) => tag.name == "Name")?.value ||
          "arweave video",
      };
    },
  });

  return {
    video: data,
    isVideoLoading: isLoading,
    isVideoError: isError,
    error,
  };
};

export default useVideo;
