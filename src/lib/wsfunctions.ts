import WebSocket from "ws";
import delay from "delay"
import { HP, JsonMsg, dirId } from "./config";
import { writeFileSync } from "fs";

let mesinsms: HP = {}

export const connection = async (ws: WebSocket) => {
  console.log('new connection...')
  let currentHp = ''
  ws.on('message', (message: string) => incoming(message, ws, currentHp, (idhp: string) => currentHp = idhp))
  ws.on('close', (code: number, reason: string) => { })
  // jika tidak terregistrasi dalam tiga detik maka koneksi akan diputus
  await delay(3000)
  if (currentHp === '') ws.close(1012, 'ID HP belum terregistrasi')
}

const incoming = (message: string, ws: WebSocket, currentHp: string, callback: any) => {
  console.log(message)
  let json: JsonMsg = {
    action: 'noaction'
  }
  try {
    const tempJson = JSON.parse(message)
    if (typeof tempJson.action === 'string') json = tempJson
  } catch (error) {
    console.error(error)
  }
  switch (json.action) {
    case 'register':
      if (typeof json.idhp === 'string') {
        currentHp = json.idhp
        mesinsms = { ...mesinsms, [currentHp]: ws }
        callback(currentHp)
        console.log(`ID HP: ${currentHp} berhasil terregistrasi`)
        console.log(Object.keys(mesinsms))
      }
      break;
    case 'report':
      let idsms: string = json.idsms ?? ''
      let status: string = json.message ?? ''
      if (idsms !== '' && status !== '')
        writeFileSync(dirId + idsms, JSON.stringify({ status }))
      break
    default:
      ws.close(1011, 'Pesan tidak valid')
      break;
  }
}

export const getMesinsms = (): HP => mesinsms