import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import { createStream } from 'rotating-file-stream'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cria o caminho para a pasta
const caminhoPasta = path.join(__dirname, '../logs')

// Valida a existencia da pasta
if (!fs.existsSync(caminhoPasta)) {
  fs.mkdirSync(caminhoPasta)
}

const fluxoRegistroRotas = createStream('access.log', {
  interval: '1d',
  size: '10M',
  path: caminhoPasta,
})

const registroRotas = morgan('combined', { stream: fluxoRegistroRotas })

export { registroRotas }
