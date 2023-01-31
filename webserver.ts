import { GraphQLServer, JsonLogger, serve } from './deps.ts'
import { userSchema, userSchemaResolvers } from './ExampleSchemas.ts'

const graphQLServerPort = 3592
const logger = new JsonLogger('deno-graphql-server', 'user-service', false)

const customGraphQLServer = new GraphQLServer({
   schema: userSchema,
   rootValue: userSchemaResolvers,
   logger: logger,
})

async function handleRequest(request: Request): Promise<Response> {
   if (request.method === 'POST') {
      const body = await request.json()
      const graphQLResponse = await customGraphQLServer.handleRequest({
         body: body,
         headers: { 'content-type': 'application/json' },
         url: request.url,
         method: request.method,
      })
      const response = new Response(
         JSON.stringify(graphQLResponse.executionResult),
         {
            status: graphQLResponse.statusCode,
         },
      )
      const metrics = await customGraphQLServer.getMetrics()
      logger.info(`Metrics are ${metrics}`)
      return response
   } 
   return new Response('{message:"Welcome to deno-graphql example. Please use POST method to send your GraphQL request to this API!"}');
}

serve(handleRequest, { port: graphQLServerPort })
