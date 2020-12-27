import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodo')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getTodo, updateTodo } from '../../businessLogic/todo'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO:DONE Update a TODO item with the provided id using values in the "updatedTodo" object
    logger.info('Updating info', event)
    const todoId = event.pathParameters.todoId
    const updateRequest: UpdateTodoRequest = JSON.parse(event.body)
    const item = await getTodo(todoId)
    const updatedTodo = await updateTodo(item, updateRequest)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: updatedTodo
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
