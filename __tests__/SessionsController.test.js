"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const connection_1 = require("../src/database/connection");
const UserRepository_1 = require("../src/database/repositories/UserRepository");
describe('Sessions Controller', () => {
    const psqlConnection = new connection_1.PsQLConnectionManager();
    const request = supertest_1.default(app_1.app);
    beforeAll(async () => await psqlConnection.connect());
    afterAll(async () => await psqlConnection.close());
    beforeEach(async () => {
        const repository = psqlConnection.getCustomRepository(UserRepository_1.UserRepository);
        repository.delete({});
    });
    const fakeUser = { email: 'fernanda@mail.com', password: '1234' };
    it('Should create the user and log on POST:/users success', async () => {
        await request.post('/api/v1/users').send(fakeUser);
        const responseLogin = await request.post('/api/v1/login').send(fakeUser);
        const { user: userLogged } = JSON.parse(responseLogin.text);
        expect(responseLogin.headers['x-access-token']);
        expect(responseLogin.status).toBe(200);
        expect(responseLogin.body).toEqual(expect.objectContaining({
            user: expect.objectContaining({ ...userLogged })
        }));
    });
    it('Should return 401 (unauthorized) on POST:/login if provided wrong password', async () => {
        await request.post('/api/v1/users').send(fakeUser);
        const wrongPassword = '3456';
        const response = await request
            .post('/api/v1/login')
            .send({ email: fakeUser.email, password: wrongPassword });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Email/Password does not match.'
        });
    });
    it('Should return 401 (unauthorized) on POST:/login if provided a not registered email', async () => {
        await request.post('/api/v1/users').send(fakeUser);
        const notRegistereduser = { email: 'fake@mail.com', password: '1234' };
        const response = await request.post('/api/v1/login').send(notRegistereduser);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Email/Password does not match.'
        });
    });
});
