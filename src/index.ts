require('dotenv').config()
import 'reflect-metadata'
import runHttp from './interfaces/http'
import runCron from './interfaces/cron'
import mongoose from './drivers/mongoose'
import { connectRedis } from './drivers/redis'

const vInterface = process.env.INTERFACE

const run = async () => {
  await mongoose()
  await connectRedis()

  switch (vInterface) {
    case 'HTTP':
      runHttp()
      break
    case 'CRON':
      runCron()
      break
    default:
      break
  }
}

run()
