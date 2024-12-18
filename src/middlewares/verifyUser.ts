import { NextFunction, Request, Response } from "express";
import JWT, { JsonWebTokenError } from "jsonwebtoken";

export default (req:Request, res:Response, next:NextFunction)=>{
    try {
        const token = req.headers["authorization"];
        if(!token) {res.status(400).json({err:"token must be provided"}); return}
        const payload = JWT.verify(token, process.env.SECRET_JWT!);
        if (!payload) {throw new Error('you are Hacker 😱')}
        (req as any).user = payload
        next()
    } catch (error) {
        res.status(401).json(error as JsonWebTokenError)
    }
}