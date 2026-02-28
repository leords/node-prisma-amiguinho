import prismaCliente from "../../prisma/index.js"
import bcrypt from "bcryptjs"

class CriarUsuarioAdminServico {
    async executar() {
        
        try {
            const senhaCriptografada = await bcrypt.hash(process.env.SENHA_ADMIN, 8)
            
            await prismaCliente.usuario.upsert({
                where: { usuario: 'admin' },
                update: {},
                create: {
                    nome: 'administrador',
                    email: 'dev.leorodrigues@gmail.com',
                    usuario: 'admin',
                    senha: senhaCriptografada,
                    nivelAcessoId: 'ADMIN',
                }
            })
            console.log("✔ Admin verificado com sucesso.")
        } catch (error) {
            console.error("Erro ao verificar/criar usuário admin", error)
        }
    }
}

export { CriarUsuarioAdminServico }