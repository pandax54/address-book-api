import supertest from 'supertest'
import { app } from '../src/app'
import { PsQLConnectionManager } from '../src/database/connection'
import { UserRepository } from '../src/database/repositories/UserRepository'

describe('Sessions Controller', () => {
  const psqlConnection = new PsQLConnectionManager()
  const request = supertest(app)

  beforeAll(async () => await psqlConnection.connect())
  afterAll(async () => await psqlConnection.close())

  beforeEach(async () => {
    const repository = psqlConnection.getCustomRepository(UserRepository)
    repository.delete({})
  })

  const fakeUser = { email: 'fernanda@mail.com', password: '1234' }

  it('Should create the user and log on POST:/users success', async () => {
    // create User
    await request.post('/api/v1/users').send(fakeUser)

    // login User - match password and JWT auth
    const responseLogin = await request.post('/api/v1/login').send(fakeUser)

    const { user: userLogged } = JSON.parse(responseLogin.text)

    expect(responseLogin.headers['x-access-token'])
    expect(responseLogin.status).toBe(200)
    expect(responseLogin.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({ ...userLogged })
      })
    )
  })

  it('Should return 401 (unauthorized) on POST:/login if provided wrong password', async () => {
    // create User
    await request.post('/api/v1/users').send(fakeUser)

    const wrongPassword = '3456'

    const response = await request
      .post('/api/v1/login')
      .send({ email: fakeUser.email, password: wrongPassword })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      status: 'error',
      message: 'Email/Password does not match.'
    })
  })

  it('Should return 401 (unauthorized) on POST:/login if provided a not registered email', async () => {
    // create User
    await request.post('/api/v1/users').send(fakeUser)

    const notRegistereduser = { email: 'fake@mail.com', password: '1234' }

    const response = await request.post('/api/v1/login').send(notRegistereduser)

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      status: 'error',
      message: 'Email/Password does not match.'
    })
  })
})
