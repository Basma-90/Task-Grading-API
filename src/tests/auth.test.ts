import { findUserById, findUserByEmail, createUser, updateUser } from "../services/user.services";
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt.utils';
import bcrypt from 'bcrypt';
import supertest from "supertest";
import server from '../index';
import { dbConnect, dbDisconnect } from "../configDB/db.config";


beforeAll(async () => {
    await dbConnect();
});

afterAll(async () => {
    await server.close();
    await dbDisconnect();
});

jest.mock('bcrypt');
jest.mock('../utils/jwt.utils', () => ({
    generateToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    verifyToken: jest.fn(),
}));
jest.mock('../services/user.services', () => ({
    findUserById: jest.fn(),
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
}));

describe('loginUser', () => {
    it('should log in the user successfully', async () => {
        const mockUser = {
            _id: '1',
            name: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10),
            role: 'user',
            refreshToken: ''
        };

        (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
        mockUser.refreshToken = 'refreshToken';
        (updateUser as jest.Mock).mockResolvedValue(mockUser);
        (generateToken as jest.Mock).mockReturnValue('accessToken');

        await supertest(server)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password' })
            .expect(200)
            .expect('Set-Cookie', 'refreshToken=refreshToken; Path=/; HttpOnly; Secure; SameSite=Strict')
            .expect({ accessToken: 'accessToken' });
    });

    it('should return 400 if user not found', async () => {
        (findUserByEmail as jest.Mock).mockResolvedValue(null);

        await supertest(server)
            .post('/api/users/login')
            .send({ email: 'user@example.com', password: 'password' })
            .expect(400)
            .expect({ message: 'Invalid credentials' });
    }
);

it('should return 400 if password is incorrect', async () => {
    const mockUser = {
        _id: '1',
        name: 'test',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'user',
        refreshToken: ''
    };
        (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
        (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
        mockUser.refreshToken = 'refreshToken';
        (updateUser as jest.Mock).mockResolvedValue(mockUser);
        (generateToken as jest.Mock).mockReturnValue('accessToken');

        await supertest(server)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' })
            .expect(400)
            .expect({ message: 'Invalid credentials' });
    });
});

describe('registerUser', () => {
    it('should register the user successfully', async () => {
        const mockUser = {
            _id: '1',
            name: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10),
            role: 'user',
            refreshToken: ''
        };
        (findUserByEmail as jest.Mock).mockResolvedValue(null);
        (createUser as jest.Mock).mockResolvedValue(mockUser);
        (generateToken as jest.Mock).mockReturnValue('accessToken');
        (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
        mockUser.refreshToken = 'refreshToken';
        await supertest(server).post('/api/users/register')
        .send({ name: 'test', email: 'test@example.com', password: 'password', role: 'user' })
        .expect(201)
        .expect({ accessToken: 'accessToken'});
    });

    it.concurrent('should return 400 if user already exists', async () => {
        const mockUser = {
            _id: '1',
            name: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10),
            role: 'user',
            refreshToken: ''
        };
        (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (createUser as jest.Mock).mockResolvedValue(mockUser);
        (generateToken as jest.Mock).mockReturnValue('accessToken');
        (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
        await supertest(server).post('/api/users/register')
        .send({ name: 'test', email: 'test@example.com', password: 'password', role: 'user' })
        .expect(400)
        .expect({ message: 'User already exists' });
    }
);
});

describe('refreshToken', () => {
    it('should return a new access token', async () => {
        const mockUser = {
            _id: '1',
            name: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10),
            role: 'user',
            refreshToken:''
        };
        (verifyToken as jest.Mock).mockReturnValue({ user: { id: '1' } });
        (findUserById as jest.Mock).mockResolvedValue(mockUser);
        (generateToken as jest.Mock).mockReturnValue('accessToken');
        mockUser.refreshToken='refreshToken';
        await supertest(server)
        .post('/api/users/refresh')
        .set('Cookie', 'refreshToken=refreshToken')
        .expect(200)
        .expect({ accessToken: 'accessToken' });
    })

    it.concurrent('test should return 400 if refresh token is invalid', async () => {
        (verifyToken as jest.Mock).mockReturnValue(null);
        await supertest(server)
        .post('/api/users/refresh')
        .expect(400)
        .expect({ message: 'Refresh token not found' });
    });

    it('test should return 400 if user not found', async () => {
        (verifyToken as jest.Mock).mockReturnValue({ user: { id: '1' } });
        (findUserById as jest.Mock).mockResolvedValue(null);
        await supertest(server)
        .post('/api/users/refresh')
        .set('Cookie', 'refreshToken=refreshToken')
        .expect(400)
        .expect({ message: 'Invalid refresh token' });
    });

    it('test should return 400 if refresh token is invalid', async () => {
        const mockUser = {
            _id: '1',
            name: 'test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10),
            role: 'user',
            refreshToken:''
        };
        (verifyToken as jest.Mock).mockReturnValue({ user: { id: '1' } });
        (findUserById as jest.Mock).mockResolvedValue(mockUser);
        await supertest(server)
        .post('/api/users/refresh')
        .set('Cookie', 'refreshToken=invalidToken')
        .expect(400)
        .expect({ message: 'Invalid refresh token' });
    });
    it('Server error', async () => {
        (verifyToken as jest.Mock).mockImplementation(() => { throw new Error('Some server error'); });

        await supertest(server)
            .post('/api/users/refresh')
            .set('Cookie', 'refreshToken=someToken')
            .expect(500, { message: 'Internal server error' });
    });
});

describe('Logout', () => {
    test('Successful logout clears cookie and returns message', async () => {
        await supertest(server)
            .post('/api/users/logout')
            .expect(200)
            .expect('Set-Cookie', /refreshToken=;/)
            .expect({ message: 'User logged out successfully' });
    });
});
