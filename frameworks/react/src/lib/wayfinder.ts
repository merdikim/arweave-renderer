// import { ARIO } from "@ar.io/sdk";
import {
  createWayfinderClient,
  StaticRoutingStrategy,
} from "@ar.io/wayfinder-core";
import { TMedia } from "@/types";
import { isArweaveId } from "@/utils";

const wayfinder = createWayfinderClient({
  routingStrategy: new StaticRoutingStrategy({
    gateway: "https://arweave.net",
  }),
});

const requestArweaveData = async (id: string) => {
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

const requestMedia = async (id: string): Promise<TMedia> => {
  if (!isArweaveId(id)) return {} as TMedia;
  try {
    const response = await requestArweaveData(id);

    const { data } = await response.json();
    if (!data) return {} as TMedia;
    const edges = data.transactions.edges;
    if (edges.length == 0) return {} as TMedia;
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

const requestMarkDown = async (id: string): Promise<string> => {
  if (!isArweaveId(id)) return "";
  try {
    const response = await requestArweaveData(id);
    return await response.text();
  } catch (error) {
    throw error;
  }
};

export { requestMedia, requestMarkDown };
