import { useQuery } from "@tanstack/react-query";
import type { Tag, TMarkDown } from "@/types";
import { getCategoryByMimeType } from "@/utils";
import { requestMedia, requestMarkDown } from "@/lib/wayfinder";

const useMarkDown = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["markdown", id],
    queryFn: async (): Promise<TMarkDown> => {
      const result = await requestMedia(id || "");

      const contentMimeType = result?.tags?.find(
        (tag: Tag) => tag.name == "Content-Type",
      );
      const contentCategory = getCategoryByMimeType(
        contentMimeType?.value || "",
      );

      if (contentCategory !== "markdown") {
        console.log("Not markdown", id);
        throw new Error("Not markdown");
      }

      const text = await requestMarkDown(id || "");

      return {
        text,
        name:
          result.tags.find((tag: Tag) => tag.name == "Name")?.value ||
          "markdown",
      };
    },
  });

  return {
    markDown: data,
    isMarkDownLoading: isLoading,
    isMarkDownError: isError,
    error,
  };
};

export default useMarkDown;
