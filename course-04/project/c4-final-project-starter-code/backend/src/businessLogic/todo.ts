import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoItemAccess } from '../dataLayer/todoItemAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoItemAccess = new TodoItemAccess()
const bucketName = process.env.IMAGES_S3_BUCKET

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todoItemAccess.getAllTodos(userId)
}

export async function getTodo(todoId: string): Promise<TodoItem> {
  return todoItemAccess.getTodo(todoId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const itemId = uuid.v4()

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

export async function deleteTodo(todoId: string): Promise<boolean> {
  return await todoItemAccess.deleteTodo(todoId)
}
