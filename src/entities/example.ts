import { ExampleSchema } from '../drivers/mongoose/models/example'

export type ExampleEntity = {
  id?: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export const toExampleEntity = (
  params: ExampleSchema | null,
): ExampleEntity | null => {
  if (!params) return null
  return {
    id: params.id,
    name: params.name,
    description: params.description,
    createdAt: params.createdAt?.toISOString(),
    updatedAt: params.updatedAt?.toISOString(),
  }
}
