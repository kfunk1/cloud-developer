import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../../auth/utils'
import { createTodo } from '../../businessLogic/todo'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO:DONE Implement creating a new TODO item
    logger.info('Creating a TodoItem', event)

    const parsedTodo: CreateTodoRequest = JSON.parse(event.body)
    console.log('event.headers', event.headers)
    const userId: string = getUserId(event)
    const createdTodo = await createTodo(parsedTodo, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({ item: createdTodo })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
