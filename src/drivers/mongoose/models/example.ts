import mongoose, { Schema, Document } from 'mongoose'

export type ExampleSchema = Document & {
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const exampleSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
  },
  { timestamps: true },
)

export const ExampleModel = mongoose.model<ExampleSchema>(
  'example',
  exampleSchema,
)
