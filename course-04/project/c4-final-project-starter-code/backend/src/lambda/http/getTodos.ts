import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
const logger = createLogger('getTodos')

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../../auth/utils'
import { getAllTodos } from '../../businessLogic/todo'
import { TodoItem } from '../../models/TodoItem'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    //TODO:DONE Implement this function so it return a list of todos associated with the userid
    logger.info('Get list of todos', event)
    const userId: string = getUserId(event)
    if (!userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: 'You must be logged in to get your todos'
        })
      }
    }
    const todos: TodoItem[] = await getAllTodos(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({ items: todos })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
