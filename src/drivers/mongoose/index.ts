import { connect } from 'mongoose'

const connectDB = async () => {
  return connect(process.env.MONGODB_URI || '').catch((error: any) => {
    console.error('Error connecting to MongoDB:', error.message)
  })
}

export = connectDB
