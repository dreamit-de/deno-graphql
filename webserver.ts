import { GraphQLServer, JsonLogger, serve } from './deps.ts';
import { userSchema, userSchemaResolvers } from './ExampleSchemas.ts';

const graphQLServerPort = 3592;
const customGraphQLServer = new GraphQLServer({
   schema: userSchema,
   rootValue: userSchemaResolvers,
   logger: new JsonLogger('deno-graphql-server', 'user-service', false),
});

async function handleRequest(request: Request): Promise<Response> {
   const body = await request.json();
   const graphQLResponse = await customGraphQLServer.handleRequest({
      body: body,
      headers: { 'content-type': 'application/json' },
      url: request.url,
      method: request.method,
   });
   const response = new Response(
      JSON.stringify(graphQLResponse.executionResult),
      {
         status: graphQLResponse.statusCode,
      },
   );
   return response;
}

serve(handleRequest, { port: graphQLServerPort });
