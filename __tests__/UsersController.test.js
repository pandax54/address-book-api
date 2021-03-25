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
describe('Users Controller', () => {
    const psqlConnection = new connection_1.PsQLConnectionManager();
    const request = supertest_1.default(app_1.app);
    beforeAll(async () => await psqlConnection.connect());
    afterAll(async () => await psqlConnection.close());
    beforeEach(async () => {
        const repository = psqlConnection.getCustomRepository(UserRepository_1.UserRepository);
        repository.delete({});
    });
    const fakeUser = { email: 'fernanda@mail.com', password: '1234' };
    it('Should create a user and login on POST:/users success', async () => {
        const response = await request.post('/api/v1/users').send(fakeUser);
        const data = JSON.parse(response.text);
        expect(response.status).toBe(201);
        expect(response.headers['x-access-token']);
        expect(response.body).toEqual(expect.objectContaining({
            user: expect.objectContaining({
                email: 'fernanda@mail.com',
                id: data.user.id,
                created_at: data.user.created_at
            })
        }));
    });
    it('Should return 409 on POST:/users if provided email is already in use', async () => {
        await request.post('/api/v1/users').send(fakeUser);
        const response = await request.post('/api/v1/users').send(fakeUser);
        expect(response.status).toBe(409);
        expect(response.body).toEqual({
            message: 'Email already registered.',
            status: 'error'
        });
    });
    it('Should return the logged user GET:/users/me success', async () => {
        const responseCreateUser = await request
            .post('/api/v1/users')
            .send(fakeUser);
        const data = JSON.parse(responseCreateUser.text);
        const token = await jwtAuthLogin.generateJWT(data.user.id);
        const response = await request
            .get('/api/v1/users/me')
            .set('x-access-token', token);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
    });
});
