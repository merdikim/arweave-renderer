import { ARIO } from "@ar.io/sdk";
import { createWayfinderClient, FastestPingRoutingStrategy, NetworkGatewaysProvider, PreferredWithFallbackRoutingStrategy } from "@ar.io/wayfinder-core";
import { TArweaveData } from "../types";

const gatewayProvider = new NetworkGatewaysProvider({
  ario: ARIO.mainnet(),
  sortBy: 'operatorStake',
  limit: 5,
  sortOrder:"desc"
});

const fastestPingStrategy = new FastestPingRoutingStrategy({
  timeoutMs: 500,
  gatewaysProvider: gatewayProvider,
});


const strategy = new PreferredWithFallbackRoutingStrategy({
  preferredGateway: "https://arweave.net",
  fallbackStrategy: fastestPingStrategy,
});


const wayfinder = createWayfinderClient({
  ario:ARIO.mainnet(),
  routingStrategy: strategy
  
});

const requestGraphQL = async (id: string):Promise<TArweaveData> => {
  console.log(id)

  try {
    const response = await wayfinder.request("ar:///graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            transactions(first:1, ids: ["xf958qhCNGfDme1FtoiD6DtMfDENDbtxZpjOM_1tsMM"]) {
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

    const data = await response.json();
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

export { requestGraphQL };
