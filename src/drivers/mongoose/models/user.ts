import mongoose, { Schema, Document } from 'mongoose'

export type UserSchema = Document & {
  user_name: string
  account_number: string
  email_address: string
  identity_number: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema(
  {
    user_name: { type: String, required: true, trim: true },
    account_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email_address: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    identity_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true },
)

export const UserModel = mongoose.model<UserSchema>('user', userSchema)
