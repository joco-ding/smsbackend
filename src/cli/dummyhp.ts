import yargs from "yargs";
import WebSocket from "ws";
import delay from "delay";

const argv = yargs
  .usage('Usage: node cli/$0 -i <id mesin sms>')
  .demandOption('i')
  .argv

const main = (): void => {
  const ws = new WebSocket('http://localhost:10001/mesinsms')
  ws.on('open', async () => {
    ws.send(JSON.stringify({
      action: 'register',
      idhp: argv.i
    }))
  })
  ws.on('close', (code, reason) => {
    console.log(`Connection is closed with Code: ${code} Reason: ${reason}`)
  })
  ws.on('message', async (message: string) => {
    console.log(message)
    let json = null
    try {
      json = JSON.parse(message)
    } catch (error) {
      console.error(error)
      ws.send(JSON.stringify({ action: 'report', message: 'Failed!' }))
    }
    if (json !== null && typeof json.idsms === 'string') {
      await delay(15000)
      ws.send(JSON.stringify({ action: 'report', idsms: json.idsms, message: 'Terkirim!' }))
    }
  })
}
main()