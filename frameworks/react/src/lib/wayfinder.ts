import { ARIO } from "@ar.io/sdk";
import { NetworkGatewaysProvider, Wayfinder } from "@ar.io/wayfinder-core";
import { TArweaveData } from "../types";

const wayfinder = new Wayfinder({
  gatewaysProvider: new NetworkGatewaysProvider({
    ario: ARIO.mainnet(),
    sortBy: "operatorStake",
    sortOrder: "desc",
    limit: 10,
  }),
});

const requestGraphQL = async (id: string):Promise<TArweaveData> => {
  console.log(id);
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
    console.log(data)
    console.log(data.data)
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
