import WebSocket from "ws";

export interface JsonMsg {
  action: string;
  [key: string]: any;
}

export interface HP {
  [key: string]: WebSocket
}

export const dirId = './idlog/'