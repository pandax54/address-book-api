"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const connection_1 = require("../src/database/connection");
const UserRepository_1 = require("../src/database/repositories/UserRepository");
const generateAuth_1 = __importDefault(require("../src/utils/generateAuth"));
const jwtAuthLogin = new generateAuth_1.default();
describe('Contacts Controller', () => {
    const psqlConnection = new connection_1.PsQLConnectionManager();
    const request = supertest_1.default(app_1.app);
    beforeAll(async () => await psqlConnection.connect());
    afterAll(async () => await psqlConnection.close());
    beforeEach(async () => {
        const repository = psqlConnection.getCustomRepository(UserRepository_1.UserRepository);
        repository.delete({});
    });
    const fakeUser = { email: 'fernanda@mail.com', password: '1234' };
    const fakeContact = {
        first_name: 'Fernanda',
        last_name: 'Penna',
        phone_number: '+55027999753844',
        address: 'Buckingham Palace London SW1A 1AA'
    };
    it('Should return 401 (unauthorized) on POST:/contact if provided no authentication token', async () => {
        const responseUser = await request.post('/api/v1/users').send(fakeUser);
        const data = responseUser.body;
        const response = await request
            .post('/api/v1/contact')
            .send({ ...fakeContact, user_id: data.user.id });
        expect(response.status).toBe(401);
    });
    it('Should add a new contact on POST:/contact success', async () => {
        const responseUser = await request.post('/api/v1/users').send(fakeUser);
        const data = responseUser.body;
        const token = await jwtAuthLogin.generateJWT(data.user.id);
        const response = await request
            .post('/api/v1/contact')
            .set('x-access-token', token)
            .send({ ...fakeContact });
        expect(response.status).toBe(201);
        expect(response.text).toEqual('Contact added with success!');
    });
    it('Should return the list of contacts of logged user on GET:/contact success', async () => {
        const responseUser = await request.post('/api/v1/users').send(fakeUser);
        const data = responseUser.body;
        const token = await jwtAuthLogin.generateJWT(data.user.id);
        await request
            .post('/api/v1/contact')
            .set('x-access-token', token)
            .send({ ...fakeContact });
        const response = await request
            .get('/api/v1/contact')
            .set('x-access-token', token)
            .send({ user_id: data.user.id });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('contacts');
    });
});
