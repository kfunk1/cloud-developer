import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'

export class TodoItemAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODO_TABLE
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all Todos')

    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async getTodo(userId: string, todoId: string): Promise<TodoItem> {
    const result = await this.docClient
      .get({
        TableName: this.todoTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()

    return result.Item as TodoItem
  }

  async putTodo(todoItem: TodoItem): Promise<TodoItem> {
    console.log('todoItem', todoItem)
    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: todoItem
      })
      .promise()

    return todoItem
  }

  async deleteTodo(userId: string, todoId: string): Promise<boolean> {
    await this.docClient
      .delete({
        TableName: this.todoTable,
        Key: { userId, todoId }
      })
      .promise()
    return true
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
