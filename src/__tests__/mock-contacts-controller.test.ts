import supertest from 'supertest'
import { app } from '../app'
import { PsQLConnectionManager } from '../database/connection'
import { UserRepository } from '../database/repositories/UserRepository'
const { mockCollection } = require('firestore-jest-mock/mocks/firestore');
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

  it('Should return 401 (unauthorized) on POST:/contact if provided no authentication token', async () => {
    
    // create User
    const responseUser = await request.post('/api/v1/users').send(fakeUser)
    const data =  JSON.parse(responseUser.text)
   

    const response = await request.post('/api/v1/contact').send({...fakeContact, userId: data.user.id})

    expect(response.status).toBe(401)
  
  })

  it('Should add a new contact on POST:/contact success', async () => {
    const firebase = require('firebase'); 
    const db = firebase.firestore();
    
    // create User
    const responseUser = await request.post('/api/v1/users').send(fakeUser)
    const data =  JSON.parse(responseUser.text)
   
    const token = await jwtAuthLogin.generateJWT(data.user.id)


    const response = await request.post('/api/v1/contact').set('x-access-token', token).send({...fakeContact})

    expect(response.status).toBe(201)
    expect(response.text).toEqual("Contact added with success!")
  })


  it('Should return the list of contacts of logged user on GET:/contact success', async () => {
    
    // create User
    const responseUser = await request.post('/api/v1/users').send(fakeUser)
    const data =  JSON.parse(responseUser.text)
   
    const token = await jwtAuthLogin.generateJWT(data.user.id)

    // add a new contact (without the login)
    await request.post('/api/v1/contact').set('x-access-token', token).send({...fakeContact})

    const response = await request.get('/api/v1/contact').set('x-access-token', token).send({userId: data.user.id})

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("contacts")
  })
})
