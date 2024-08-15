import { Request, Response, Router } from 'express';
import { registerUser, loginUser, logoutUser, refreshToken } from '../controllers/auth.controller';

const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
authRouter.post('/register', registerUser);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
authRouter.post('/login', loginUser);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Bad request
 */
authRouter.post('/logout', logoutUser);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
authRouter.post('/refresh', refreshToken);

export default authRouter;
