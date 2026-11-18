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

app.listen(3000, () => {
    console.log("Servidor online")
})

export default app