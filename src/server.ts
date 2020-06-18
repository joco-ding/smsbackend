import { app, port } from "./lib/app";

app.listen(port)
console.log(`API & WebSocket is listening on ${port}`)