import supertest from 'supertest'
import { app } from '../src/app'
import { PsQLConnectionManager } from '../src/database/connection'
import { UserRepository } from '../src/database/repositories/UserRepository'
import JWTAuthentication from '../src/utils/generateAuth'
const jwtAuthLogin = new JWTAuthentication()

describe('Users Controller', () => {
  const psqlConnection = new PsQLConnectionManager()
  const request = supertest(app)

  beforeAll(async () => await psqlConnection.connect())
  afterAll(async () => await psqlConnection.close())

  beforeEach(async () => {
    const repository = psqlConnection.getCustomRepository(UserRepository)
    repository.delete({})
  })

  const fakeUser = { email: 'fernanda@mail.com', password: '1234' }

  it('Should create a user and login on POST:/users success', async () => {
    const response = await request.post('/api/v1/users').send(fakeUser)
    const data = JSON.parse(response.text)

    expect(response.status).toBe(201)
    expect(response.headers['x-access-token'])
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          email: 'fernanda@mail.com',
          id: data.user.id,
          created_at: data.user.created_at
        })
      })
    )
  })

  it('Should return 409 on POST:/users if provided email is already in use', async () => {
    await request.post('/api/v1/users').send(fakeUser)
    const response = await request.post('/api/v1/users').send(fakeUser)

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      message: 'Email already registered.',
      status: 'error'
    })
  })

  it('Should return the logged user GET:/users/me success', async () => {
    const responseCreateUser = await request
      .post('/api/v1/users')
      .send(fakeUser)
    const data = JSON.parse(responseCreateUser.text)
    const token = await jwtAuthLogin.generateJWT(data.user.id)

    const response = await request
      .get('/api/v1/users/me')
      .set('x-access-token', token)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
  })
})
