import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import response from '../responses/response.js';

const authMiddleware = (req, res, next) =>{
    const authHeader = req.header["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return response(401, "Token Empty", null, res )
    }
    jwt.verify(token, process.env.JWT_ACCESS, (err, decoded) =>{
        if (err) {
            return response(403, "Token invalid", null, res)
        }
        req.user = decoded;
        next();
    })
}

export default authMiddleware