import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs"
import { dirId } from "./config"
import { Request, Response } from "express"
import { getMesinsms } from "./wsfunctions"

export const genId = (): string => {
  let id = ''
  if (existsSync(dirId) === false) mkdirSync(dirId)
  const huruf = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'
  const endHuruf = huruf.length
  while (true) {
    const acak = Math.floor(Math.random() * endHuruf)
    id = id + huruf[acak]
    if (id.length >= 5) {
      if (existsSync(dirId + id) === false) break
      else id = ''
    }
  }
  return id
}

export const sendsms = (req: Request, res: Response) => {
  const mesinsms = getMesinsms()
  const { idhp, phoneno, message } = req.body
  try {
    if (typeof idhp === 'string' && typeof phoneno === 'string' && typeof message === 'string') {
      const isTest = process.env.NODE_ENV === 'test'
      if (typeof mesinsms[idhp] !== 'undefined' || isTest) {
        const idsms = genId()
        const status = 'Mengirim'
        writeFileSync(dirId + idsms, JSON.stringify({ status }))
        if (isTest === false)
          mesinsms[idhp].send(JSON.stringify({ idsms, phoneno, message }))
        res.json({ ok: true, message: status, idsms })
      } else res.status(404).json({ ok: false, message: 'HP tidak terhubung' })
    } else res.status(500).json({ ok: false, message: 'Parameter tidak valid' })
  } catch (error) {
    console.error(error)
  }
}

export const getStatus = (req: Request, res: Response) => {
  const { idsms } = req.params
  if (typeof idsms === 'string') {
    const pattern = /^[a-z0-9]+$/i
    const testing = pattern.exec(idsms)
    if (testing !== null && typeof testing[0] === 'string' && testing[0] === idsms) {
      if (existsSync(dirId + idsms)) {
        try {
          const json = JSON.parse(readFileSync(dirId + idsms, 'utf-8'))
          if (typeof json.status === 'string')
            res.json({ ok: true, message: json.status })
          else
            res.status(500).json({ ok: false, message: 'Masalah di sistem' })
        } catch (error) {
          console.error(error)
          res.status(500).json({ ok: false, message: 'Masalah di sistem' })
        }
      } else res.status(404).json({ ok: false, message: 'ID SMS tidak ditemukan' })
    } else res.status(500).json({ ok: false, message: 'ID SMS tidak valid' })
  } else res.status(500).json({ ok: false, message: 'ID SMS tidak valid' })
}