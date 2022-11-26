import express from "npm:express";
import bodyParser from "npm:body-parser";
import {
  GraphQLServer,
  GraphQLServerRequest,
  GraphQLServerResponse,
  JsonLogger,
} from "./deps.ts";
import { userSchema, userSchemaResolvers } from "./ExampleSchemas.ts";


const graphQLServerPort = 3592;
const graphQLServerExpress = express();
const customGraphQLServer = new GraphQLServer({
  schema: userSchema,
  rootValue: userSchemaResolvers,
  logger: new JsonLogger('Test logger', 'Deno example service')
});
graphQLServerExpress.use(bodyParser.text({ type: "*/*" }));
graphQLServerExpress.all(
  "/graphql",
  (req: GraphQLServerRequest, res: GraphQLServerResponse) => {
    return customGraphQLServer.handleRequestAndSendResponse(req, res);
  },
);
graphQLServerExpress.listen({ port: graphQLServerPort });
console.info(`Starting GraphQL server on port ${graphQLServerPort}`);
