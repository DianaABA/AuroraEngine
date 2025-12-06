import { createServer } from 'http'
import { handleAuroraAssistant } from './api/aurora-assistant'

const server = createServer(async (req, res) => {
  const url = req.url || ''
  const method = req.method || 'GET'
  if (url.startsWith('/api/assistant/chat') && method === 'POST') {
    // Collect body
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', async () => {
      ;(req as any).body = body
      await handleAuroraAssistant(req as any, res as any)
    })
    return
  }
  res.statusCode = 404
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ ok:false, error:'not_found' }))
})

const port = Number(process.env.PORT || 8787)
server.listen(port, () => {
  console.log(`[assistant-dev] listening on http://localhost:${port}`)
})
