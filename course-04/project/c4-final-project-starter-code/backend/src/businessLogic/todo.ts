import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoItemAccess } from '../dataLayer/todoItemAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { getUserId } from '../auth/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'

const todoItemAccess = new TodoItemAccess()
const bucketName = process.env.IMAGES_S3_BUCKET

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todoItemAccess.getAllTodos(userId)
}

export async function getTodo(todoId: string, event: APIGatewayProxyEvent): Promise<TodoItem> {
  const userId = getUserId(event);
  return todoItemAccess.getTodo(userId, todoId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  event: APIGatewayProxyEvent
): Promise<TodoItem> {
  const itemId = uuid.v4()
  const userId = getUserId(event);
  return await todoItemAccess.putTodo({
    userId: userId,
    todoId: itemId,
    done: false,
    createdAt: new Date().toISOString(),
    ...createTodoRequest
  })
}

export async function updateTodo(
  item: TodoItem,
  updateTodoRequest: UpdateTodoRequest
): Promise<TodoItem> {
  const updatedItem: TodoItem = { ...item, ...updateTodoRequest }
  return await todoItemAccess.putTodo(updatedItem)
}

export async function updateImageTodo(
  item: TodoItem,
  imageId: string
): Promise<TodoItem> {
  const imageUrl: string = `https://${bucketName}.s3.amazonaws.com/${imageId}`
  const updatedItem = { ...item, attachmentUrl: imageUrl }
  return await todoItemAccess.putTodo(updatedItem)
}

export async function deleteTodo(todoId: string, event: APIGatewayProxyEvent): Promise<boolean> {
  const userId = getUserId(event);
  return await todoItemAccess.deleteTodo(userId, todoId)
}
