import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todo'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO:DONE Remove a TODO item by id
    logger.info('Deleting a TodoItem', event)
    console.log("Deleting a TodoItem", event)

    const todoId = event.pathParameters.todoId
    await deleteTodo(todoId, event)

    return {
      statusCode: 200,
      body: JSON.stringify({
        todoId
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
