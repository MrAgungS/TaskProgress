import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"

import { Users, refreshToken } from "../models/association.js";
import response from "../responses/response.js";
import { loadEnv } from "../config/env.js";

loadEnv

export const register = async (req, res) => {    
    try {
        
        const { name, email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = await Users.create({ name, email, password: hash });

        response(200, "Register Success", {
            id: user.id,
            name : user.name,
            email : user.email
        }, res);
    } catch (error) {
        console.log("error bro", error);
        response(500,"Register Error", null, res);
    }
};

export const login = async (req, res) => {
    try {
        console.log("REQ BODY >>>", req.body); // 🔥 DEBUG
        const { email, password } = req.body;
        
        const users = await Users.findOne({ where: {email} })
        if (!users) {
            return response(401, "Cannot find the Email", null , res)
        }
        
        const match = await bcrypt.compare(password, users.password)
        if (!match) {
            return response(401, "Wrong Password", null , res)
        }
        // Access Token
        const accessToken = jwt.sign(
            {id:users.id, email:users.email, role:users.role},
            process.env.JWT_ACCESS,
            {expiresIn: "15m"}
        )
        // Refresh Token
        const refreshTokenValue = crypto.randomBytes(64).toString("hex");
        await refreshToken.create({
            token: refreshTokenValue,
            user_id: users.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        res.cookie("accessToken", accessToken , {
            httpOnly:true,
            secure:false, //true if HTTPS
            sameSite: "lax",
            maxAge: 15 * 60 * 1000 // 15m
        })
        res.cookie("refreshToken", refreshTokenValue, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
        });

        
        return response(200, "Login Success", {
            user: {
                id: users.id,
                email: users.email,
                role: users.role
            }
        }, res);

    } catch (error) {
        console.log(error);
        response(500,"Login Error", null, res);
    }
};

export const refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
        return response(401, "Refresh token tidak ada", null, res);
        }

        const storedToken = await refreshToken.findOne({
        where: { token },
        });

        if (!storedToken) {
        return response(403, "Refresh token tidak valid", null, res);
        }

        if (storedToken.expiresAt < new Date()) {
        return response(403, "Refresh token expired", null, res);
        }

        const users = await Users.findByPk(storedToken.UsersId);

        const newAccessToken = jwt.sign(
        { id: users.id, email: users.email },
        process.env.JWT_ACCESS,
        { expiresIn: "15m" }
        );

        // 🔥 SET ACCESS TOKEN KE COOKIE
        res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        });

        return response(200, "Access token refreshed", null, res);

    } catch (error) {
        console.log("REFRESH ERROR:", error);
        return response(500, "Refresh Error", null, res);
    }
};


export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            await refreshToken.destroy({
                where: {token}
            })
        }
        // Delete cookies
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });

        return response(200, "Logout Success", null, res);
    } catch (error) {
        console.log(error);
        response(500, "LogOut Error", null, res);
    }
};