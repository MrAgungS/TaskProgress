import jwt from 'jsonwebtoken';
import response from '../responses/response.js';
import { loadEnv } from '../config/env.js';

loadEnv
const authMiddleware = (req, res, next) =>{
    const token = req.cookies.accessToken;

    if (!token) {
        return response(401, "Token Empty", null, res )
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS);
        req.user = decoded;
        next();
    } catch (error) {
        response(401, "Token Expired", null, res)
    }
}

export default authMiddleware