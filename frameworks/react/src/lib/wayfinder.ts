// import { ARIO } from "@ar.io/sdk";
import {
  createWayfinderClient,
  StaticRoutingStrategy,
} from "@ar.io/wayfinder-core";
import { TArweaveData } from "../types";
import { isArweaveId } from "../utils";

const wayfinder = createWayfinderClient({
  routingStrategy: new StaticRoutingStrategy({
    gateway: "https://arweave.net",
  }),
});

const gqlRequest = async (id: string) => {
  try {
    const response = await wayfinder.request("ar:///graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            transactions(first:1, ids: ["${id}"]) {
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
        `,
      }),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const requestGraphQL = async (id: string): Promise<TArweaveData> => {
  if (!isArweaveId(id)) return {} as TArweaveData;
  try {
    const response = await gqlRequest(id);

    const { data } = await response.json();
    if (!data) return {} as TArweaveData;
    const edges = data.transactions.edges;
    if (edges.length == 0) return {} as TArweaveData;
    const { node } = edges[0];

    const url = await wayfinder.resolveUrl({
      txId: id,
    });

    return {
      url: url as unknown as string,
      tags: node.tags,
    };
  } catch (error) {
    throw error;
  }
};

const requestMarkdown = async (id: string): Promise<string> => {
  if (!isArweaveId(id)) return "";
  try {
    const response = await gqlRequest(id);
    return await response.text();
  } catch (error) {
    throw error;
  }
};

export { requestGraphQL, requestMarkdown };
