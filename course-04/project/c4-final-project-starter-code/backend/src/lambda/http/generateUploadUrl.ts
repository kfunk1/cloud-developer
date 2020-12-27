import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodo, updateImageTodo } from '../../businessLogic/todo'
import * as uuid from 'uuid'
import { getUploadUrl } from '../../businessLogic/image'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO:DONE Return a presigned URL to upload a file for a TODO item with the provided id
    logger.info('Getting signed url for s3', event)
    const todoId = event.pathParameters.todoId
    let item = await getTodo(todoId)
    console.log('item', item)
    if (!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Todo does not exist.'
        })
      }
    }

    const imageId = uuid.v4()
    const url = await getUploadUrl(imageId)

    const newItem = await updateImageTodo(item, imageId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem,
        uploadUrl: url
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
