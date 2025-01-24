import { generateClient } from "aws-amplify/api";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/fetch-connections-data";
import type { Schema } from "../data/resource"
import { Amplify } from "aws-amplify";
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();
// const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
export const handler: Schema["FetchConnectionsData"]["functionHandler"] = async (event, _context) => {
  // your function code goes here
  console.log("incoming!", event.arguments.date);
  let ret;
  let board: Promise<any>;
  if (event.arguments.date) {
    board = new Promise((resolve, reject) => {
      if (event.arguments.date) {

        client.models.DailyPuzzle.observeQuery({
          filter: {
            day: {
              eq: event.arguments.date
            }
          }
        }).subscribe({
          next: async (data) => {
            console.log('!!return val', data);
            // client.models.DailyPuzzle.create({ day: event.arguments.date, puzzle: data.items[0].puzzle });
            const dbResponse = data.items[0]?.puzzle;
            console.log("F", dbResponse);
            if (!dbResponse) {
              const nytResponse = await fetch(`https://www.nytimes.com/svc/connections/v2/${event.arguments.date}.json`);
              const value = await nytResponse.json();
              console.log("value", value);
              const res = await client.models.DailyPuzzle.create({ day: event.arguments.date, puzzle: JSON.stringify(value) });
              console.log("res", res);
              return resolve(value)
            } else {
              return resolve(JSON.parse(dbResponse as string));
            }
          }
        });
      }
    });
    ret = await board;
    // board = await response.body?.getReader().read();
    console.log("outgoing", board, "hello...");
  }
  return {
    board: ret,
    answer: "ww Hello from my first function!"
  };
};