import supertest from 'supertest'
import { app } from '../app'
import { PsQLConnectionManager } from '../database/connection'
import { UserRepository } from '../database/repositories/UserRepository'

import JWTAuthentication from "../utils/generateAuth";
const jwtAuthLogin = new JWTAuthentication();

describe('Contacts Controller', () => {
  const psqlConnection = new PsQLConnectionManager()
  const request = supertest(app)

  beforeAll(async () => await psqlConnection.connect())
  afterAll(async () => await psqlConnection.close())

  beforeEach(async () => {
    const repository = psqlConnection.getCustomRepository(UserRepository)
    repository.delete({})
  })

  const fakeUser = { email: 'fernanda@mail.com', password: "1234" }
  const fakeContact = {
    firstName: "Fernanda", 
    lastName: "Penna", 
    phoneNumber: "+55027998753750", 
    address: "Endereço completo"
  }

  it('Should return 400 (unauthorized) on POST:/contact if provided no authentication token', async () => {
    
    // create User
    const responseUser = await request.post('/users').send(fakeUser)
    const data =  JSON.parse(responseUser.text)

    const response = await request.post('/contact').send({...fakeContact, userId: data.user.id})

    expect(response.status).toBe(400)
  
  })

  it('Should add a new contact on POST:/contact success', async () => {
    
    // create User
    const responseUser = await request.post('/users').send(fakeUser)
    const data =  JSON.parse(responseUser.text)
    
    const token = await jwtAuthLogin.generateJWT(data.user.id)


    const response = await request.post('/contact').set('x-access-token', token).send({...fakeContact})

    expect(response.status).toBe(201)
    expect(response.text).toEqual("Contact added with success!")
  })


  it('Should return the list of contacts of logged user on GET:/contact success', async () => {
    
    // create User
    const responseUser = await request.post('/users').send(fakeUser)
    const data =  JSON.parse(responseUser.text)
    const token = await jwtAuthLogin.generateJWT(data.user.id)

    // add a new contact
    await request.post('/contact').set('x-access-token', token).send({...fakeContact})

    const response = await request.get('/contact').set('x-access-token', token).send({userId: data.user.id})

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("contacts")
  })

})
