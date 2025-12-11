import { Router } from 'express'
import { CriarNivelAcessoControlador } from '../controlador/nivelAcesso/criarNivelAcessoControlador.js'
import { ListarNivelAcessoControlador } from '../controlador/nivelAcesso/listarNivelAcessoControlador.js'
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'

const rotas = Router()

rotas.post(
  '/criar-nivel-acesso',
  autenticadorMiddleware,
  nivelAcessoMiddleware([1]),
  new CriarNivelAcessoControlador().tratar
)
rotas.get(
  '/listar-nivel-acesso',
  autenticadorMiddleware,
  nivelAcessoMiddleware([1]),
  new ListarNivelAcessoControlador().tratar
)

export { rotas as nivelAcessoRotas }
