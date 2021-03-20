import supertest from 'supertest'
import { app } from '../app'
import { PsQLConnectionManager } from '../database/connection'
import { UserRepository } from '../database/repositories/UserRepository'

describe('Users Controller', () => {
  const psqlConnection = new PsQLConnectionManager()
  const request = supertest(app)

  beforeAll(async () => await psqlConnection.connect())
  afterAll(async () => await psqlConnection.close())

  beforeEach(async () => {
    const repository = psqlConnection.getCustomRepository(UserRepository)
    repository.delete({})
  })

  const fakeUser = { email: 'fernanda@mail.com', password: "1234" }

  it('Should create a user and login on POST:/users success', async () => {
    const response = await request.post('/users').send(fakeUser)
    const data =  JSON.parse(response.text)

    expect(response.status).toBe(201)
    expect(response.headers['x-access-token'])
    expect(response.body).toEqual(expect.objectContaining({status: "ok", user: expect.objectContaining({email: 'fernanda@mail.com', id: data.user.id, created_at: data.user.created_at})  }))
  })

  it('Should return 401 (Unauthorized) on POST:/users if provided email is already in use', async () => {
    await request.post('/users').send(fakeUser)
    const response = await request.post('/users').send(fakeUser)

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ message: "Email/Password does not match.", status: "error" })
  })

})
