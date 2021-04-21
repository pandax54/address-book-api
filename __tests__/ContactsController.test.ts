import supertest from 'supertest'
import { app } from '../src/app'
import { PsQLConnectionManager } from '../src/database/connection'
import { UserRepository } from '../src/database/repositories/UserRepository'
import JWTAuthentication from '../src/utils/generateAuth'

const jwtAuthLogin = new JWTAuthentication()

describe('Contacts Controller', () => {
  const psqlConnection = new PsQLConnectionManager()
  const request = supertest(app)

  beforeAll(async () => await psqlConnection.connect())
  afterAll(async () => await psqlConnection.close())

  beforeEach(async () => {
    const repository = psqlConnection.getCustomRepository(UserRepository)
    repository.delete({})
  })

  const fakeUser = { email: 'fernanda@mail.com', password: '1234' }
  const fakeContact = {
    first_name: 'Fernanda',
    last_name: 'Penna',
    phone_number: '+55027999753844',
    address: 'Buckingham Palace London SW1A 1AA'
  }

  it('Should return 401 (unauthorized) on POST:/contact if provided no authentication token', async () => {
    // create User
    const responseUser = await request.post('/api/v1/user').send(fakeUser)
    const data = responseUser.body

    const response = await request
      .post('/api/v1/contact')
      .send({ ...fakeContact, user_id: data.user.id })

    expect(response.status).toBe(401)
  })

  it('Should add a new contact on POST:/contact success', async () => {
    // create User
    const responseUser = await request.post('/api/v1/user').send(fakeUser)
    const data = responseUser.body

    const token = await jwtAuthLogin.generateJWT(data.user.id)

    const response = await request
      .post('/api/v1/contact')
      .set('x-access-token', token)
      .send({ ...fakeContact })

    expect(response.status).toBe(201)
    expect(response.text).toEqual('Contact added with success!')
  })

  it('Should return the list of contacts of logged user on GET:/contact success', async () => {
    // create User
    const responseUser = await request.post('/api/v1/user').send(fakeUser)
    const data = responseUser.body

    const token = await jwtAuthLogin.generateJWT(data.user.id)

    // add a new contact (without the login)
    await request
      .post('/api/v1/contact')
      .set('x-access-token', token)
      .send({ ...fakeContact })

    const response = await request
      .get('/api/v1/contact')
      .set('x-access-token', token)
      .send({ user_id: data.user.id })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('contacts')
  })
})
