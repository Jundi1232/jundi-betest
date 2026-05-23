import express from 'express'

const port = process.env.CRON_PORT || 3001

const run = async () => {
  const app = express()

  // Register cron jobs here
  // Example:
  // import cron from 'node-cron'
  // cron.schedule('0 * * * *', async () => { ... })

  console.log('[cron] Cron jobs registered')

  app.listen(port, () => {
    console.log(`[cron]: Server is running at http://localhost:${port}`)
  })

  app.get('/', (req, res) =>
    res.send(`Cron Service for ${process.env.NODE_ENV}`),
  )
}

export = run
