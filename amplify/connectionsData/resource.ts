import { defineFunction } from "@aws-amplify/backend";

export const connectionsData = defineFunction({
  name: "fetch-connections-data",
  entry: "./handler.ts"
});