import { genId } from '../lib/apifunctions'

describe('Test genId function', () => {
  it('Should return five random chars', () => {
    expect(genId()).toMatch(/[a-z0-9]{5}/i)
  })
})