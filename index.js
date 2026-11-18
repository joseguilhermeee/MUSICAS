import express from "express"
import cors from "cors"
import mysql2 from "mysql2"
import "dotenv/config"

const app = express()

app.use(express.json())
app.use(cors())

const sql = mysql2.createPool({
    host: process.env.HOST_BANCO,
    user: process.env.USUARIO_BANCO,
    password: process.env.SENHA_BANCO,
    database: process.env.NOME_BANCO
})

// Rota de teste: abra http://localhost:3000/teste para ver se o banco conectou
app.get("/teste", (req, res) => {
    sql.query("SELECT 1 AS ok", (erro, resultado) => {
        if (erro) return res.status(500).json({ erro: erro.message })
        res.json(resultado)
    })
})

// Lista as músicas
app.get("/", (request, response) => {
    const comandoSelect = "SELECT * FROM musicas_joseguilherme" // troque pelo nome da SUA tabela

    sql.query(comandoSelect, (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        response.json(data)
    })
})

// Cadastra uma música
app.post("/cadastrar", (request, response) => {
    const { titulo, artista, genero, ano, duracao } = request.body

    const comandoInsert = "INSERT INTO musicas_joseguilherme(titulo, artista, genero, ano, duracao) VALUES (?, ?, ?, ?, ?)" // troque pelo nome da SUA tabela

    sql.query(comandoInsert, [titulo, artista, genero, ano, duracao], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.status(201).json({ mensagem: "Música cadastrada com sucesso!" })
    })
})

// Apaga uma música pelo id
app.delete("/apagar/:id", (request, response) => {
    const { id } = request.params

    const comandoDelete = "DELETE FROM musicas_joseguilherme WHERE id = ?" // troque pelo nome da SUA tabela

    sql.query(comandoDelete, [id], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.json({ mensagem: "Música apagada com sucesso!" })
    })
})

// Busca uma música pelo id (usada na página de editar)
app.get("/musica/:id", (request, response) => {
    const { id } = request.params

    const comandoSelect = "SELECT * FROM musicas_joseguilherme WHERE id = ?" // troque pelo nome da SUA tabela

    sql.query(comandoSelect, [id], (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        response.json(data[0])
    })
})

// Altera uma música pelo id
app.put("/editar/:id", (request, response) => {
    const { id } = request.params
    const { titulo, artista, genero, ano, duracao } = request.body

    const comandoUpdate = "UPDATE musicas_joseguilherme SET titulo = ?, artista = ?, genero = ?, ano = ?, duracao = ? WHERE id = ?" // troque pelo nome da SUA tabela

    sql.query(comandoUpdate, [titulo, artista, genero, ano, duracao, id], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.json({ mensagem: "Música alterada com sucesso!" })
    })
})

app.listen(3000, () => {
    console.log("Servidor online")
})

export default app