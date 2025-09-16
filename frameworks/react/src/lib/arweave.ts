import { gql, Client, cacheExchange, fetchExchange } from "urql";
import type { TArweaveData } from "../types";

export const goldsky = new Client({
  url: "https://arweave-search.goldsky.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

const query = () => gql`
  query ($id: ID!) {
    transactions(first: 1, ids: [$id]) {
      edges {
        node {
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`;

export const getArweaveData = async (id: string): Promise<TArweaveData> => {
  try {
    const { data } = await goldsky.query(query(), { id }).toPromise();
    if (!data) return {} as TArweaveData;
    const edges = data.transactions.edges;
    if (edges.length == 0) return {} as TArweaveData;
    const { node } = edges[0];
    return {
      id: node.id,
      tags: node.tags,
    };
  } catch (error) {
    throw error;
  }
};
