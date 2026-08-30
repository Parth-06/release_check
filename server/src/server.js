import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import releasesRouter from './routes/releases.js'

const app = express()
const port = process.env.PORT || 3000
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const clientDistPath = path.resolve(currentDirectory, '../../client/dist')

app.use(cors())
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/releases', releasesRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath))

  app.use((request, response, next) => {
    if (request.method === 'GET' && !request.path.startsWith('/api/')) {
      return response.sendFile(path.join(clientDistPath, 'index.html'))
    }

    next()
  })
}

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Unexpected server error' })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
