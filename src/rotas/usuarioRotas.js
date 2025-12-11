import { Router } from 'express'
import { NovoUsuarioControlador } from '../controlador/usuario/novoUsuarioControlador.js'
import { ListarUsuarioControlador } from '../controlador/usuario/listarUsuarioControlador.js'
import { AlterarUsuarioControlador } from '../controlador/usuario/alterarUsuarioControlador.js'
import { EsqueciSenhaControlador } from '../controlador/usuario/esqueciSenhaControlador.js'
import { ResetarSenhaControlador } from '../controlador/usuario/resetarSenhaControlador.js'
import { nivelAcessoMiddleware } from '../middleware/nivelAcessoMiddleware.js'
import { autenticadorMiddleware } from '../middleware/autenticadorMiddleware.js'
import { LoginUsuario } from '../controlador/loginUsuario/loginUsuario.js'

const rotas = Router()

rotas.post('/login', new LoginUsuario().tratar)

rotas.post(
  '/novo-usuario',
  autenticadorMiddleware,
  nivelAcessoMiddleware([1]),
  new NovoUsuarioControlador().tratar
)
rotas.get(
  '/listar-usuario',
  autenticadorMiddleware,
  nivelAcessoMiddleware([1, 3]),
  new ListarUsuarioControlador().tratar
)
rotas.patch(
  '/alterar-usuario',
  autenticadorMiddleware,
  nivelAcessoMiddleware([1]),
  new AlterarUsuarioControlador().tratar
)
rotas.post(
  '/esqueci-senha',
  autenticadorMiddleware,
  new EsqueciSenhaControlador().tratar
)
rotas.post(
  '/resetar-senha',
  autenticadorMiddleware,
  new ResetarSenhaControlador().tratar
)

export { rotas as usuarioRotas }
