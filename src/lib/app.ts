import expressWs from "express-ws"
import express from "express"
import morgan from "morgan"
import { connection } from "./wsfunctions"
import { sendsms, getStatus } from "./apifunctions"

const port = 10001
const wsInstance = expressWs(express())
const { app } = wsInstance
app.use(morgan('combined'))
app.ws('/mesinsms', connection)
app.use(express.json())
app.post('/sendsms', sendsms)
app.get('/status/:idsms', getStatus)
app.use('/', (_, res) => res.status(403).json({ ok: false, message: 'Forbidden!' }))
export { port, app }