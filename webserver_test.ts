import { userOne, usersQuery, userTwo } from './ExampleSchemas.ts'
import { assertEquals } from './dev_deps.ts'
import { startGraphQLServer } from './webserver.ts'

Deno.test('Calling startPersonServer should return expected result', async () => {
   const abortController = new AbortController()
   const server = await startGraphQLServer({
      port: 7035,
      signal: abortController.signal,
   })

   // Test root/fallback route
   let response = await fetch('http://localhost:7035/')
   assertEquals(response.status, 200)
   let responseJson = await response.json()
   assertEquals(
      responseJson.message,
      'Welcome to deno-graphql example. Please use POST method to send your GraphQL request to this API!',
   )

   // Test POST request
   response = await fetch('http://localhost:7035/graphql', {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: `{"query":"${usersQuery}"}`
   })
   assertEquals(response.status, 200)
   responseJson = await response.json()
   assertEquals(responseJson.data.users, [userOne, userTwo])

   abortController.abort()
   await server.finished
})
