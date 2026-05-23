require('dotenv').config()
import 'reflect-metadata'
import runHttp from './interfaces/http'
import runCron from './interfaces/cron'
import mongoose from './drivers/mongoose'
import { connectRedis } from './drivers/redis'
import { connectKafka } from './drivers/kafka'

const vInterface = process.env.INTERFACE

const run = async () => {
  await mongoose()
  await connectRedis()
  await connectKafka()

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
