import {
   GraphQLServer,
   JsonLogger,
   returnDataResponse,
} from './deps.ts'
import { userSchema, userSchemaResolvers } from './ExampleSchemas.ts'

const JSON_CONTENT_TYPE_HEADER = {
   'content-type': 'application/json',
}

const responseHeaders = new Headers(JSON_CONTENT_TYPE_HEADER)
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
         headers: JSON_CONTENT_TYPE_HEADER,
         url: request.url,
         method: request.method,
      })

      // const metrics = await customGraphQLServer.getMetrics()
      // logger.info(`Metrics are ${metrics}`)

      const response = new Response(
         JSON.stringify(graphQLResponse.executionResult),
         {
            status: graphQLResponse.statusCode,
            headers: responseHeaders,
         },
      )
      return response
   }
   return returnDataResponse({
      message:
         'Welcome to deno-graphql example. Please use POST method to send your GraphQL request to this API!',
   }, responseHeaders)
}

export function startGraphQLServer(
   options: Deno.ServeTcpOptions,
): Deno.HttpServer {
   return Deno.serve(options, handleRequest)
}
