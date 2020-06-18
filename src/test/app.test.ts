import supertest from "supertest"
import { app } from "../lib/app"

describe('API Request', () => {
  it('Should request to be valid', async () => {
    const response = await supertest(app)
      .post('/sendsms')
      .set('Content-Type', 'application/json')
      .send({ idhp: "android01", phoneno: "1234567890", message: "Tes Kirim" })
      .expect('content-type', /json/)
      .expect(200)

    await supertest(app)
      .get(`/status/${response.body.idsms}`)
      .expect('content-type', /json/)
      .expect(200)
  })

  it('Should be invalid parameter', async () => {
    await supertest(app)
      .post('/sendsms')
      .set('Content-Type', 'application/json')
      .send({ phoneno: "12345567898", message: "Tes Kirim" })
      .expect(500)
  })
  it('Should be not found', async () => {
    await supertest(app)
      .get('/status/012345')
      .expect(404)
  })
  it('Should be invalid parameter', async () => {
    await supertest(app)
      .get('/status/ddf=121&2=3')
      .expect(500)
  })
})