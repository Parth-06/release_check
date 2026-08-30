import express from 'express'
import releasesRouter from './routes/releases.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/releases', releasesRouter)

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Unexpected server error' })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
