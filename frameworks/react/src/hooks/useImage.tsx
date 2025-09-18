import { useQuery } from "@tanstack/react-query";
// import type { Tag } from "../types";
//import { getCategoryByMimeType } from "../utils";
import { requestGraphQL } from "../lib/wayfinder";

const useImage = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["image", id],
    queryFn: async () => {
      console.log('here now')
      const result = await requestGraphQL(id || "");
      console.log(result)
      // const contentMimeType = arweaveData?.tags?.find(
      //   (tag: Tag) => tag.name == "Content-Type",
      // );
      // const contentCategory = getCategoryByMimeType(
      //   contentMimeType?.value || "",
      // );

      // if (contentCategory !== "image") {
      //   console.log("Not an image", id);
      //   throw new Error("Not an image");
      // }

      return {
        url: "result.url",
        alt: "gkgbnfk",
        // arweaveData.tags.find((tag: Tag) => tag.name == "Name")?.value ||
        // "arweave image",
      };
    },
  });

  return { data, isImageLoading: isLoading, isImageError: isError, error };
};

export default useImage;
