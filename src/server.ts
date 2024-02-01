import express, { json, urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { connectDBMongo } from './database'
import { routes } from './routes'
import { createClient } from 'redis'

const app = express()

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3333

if (process.env.DEBUG) {
  (async () => {
    const morgan = await import('morgan')
    app.use(morgan.default('dev'))
  })()
}

app.use(urlencoded({ extended: false }))
app.use(json())

app.use(helmet())
app.use(cors(
  {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    preflightContinue: false
  }
))

app.use(routes)

const pubClient = createClient(
  {
    url: 'redis://localhost:6379'
  }
)

pubClient.connect()

pubClient.on('connect', function () {
  app.listen(PORT, async () => {
    await connectDBMongo()
    app.emit('ready')
  })
})

app.addListener('ready', () => {
  console.log(`Server running on port ${PORT}`)
})

export { pubClient as redis }
