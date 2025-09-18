import { useQuery } from "@tanstack/react-query";
import type { Tag } from "../types";
import { getCategoryByMimeType } from "../utils";
import { requestGraphQL, requestMarkdown } from "../lib/wayfinder";

const useImage = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["markdown", id],
    queryFn: async () => {
      const result = await requestGraphQL(id || "");

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

      const text = await requestMarkdown(id || "");

      return {
        text,
        name:
          result.tags.find((tag: Tag) => tag.name == "Name")?.value ||
          "markdown",
      };
    },
  });

  return {
    data,
    isMarkdownLoading: isLoading,
    isMarkdownError: isError,
    error,
  };
};

export default useImage;
