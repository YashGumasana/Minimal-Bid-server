import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { apiResponse } from "../common";
import mongoose from 'mongoose'
import { authenticationModel } from "../database";

const jwt_token_secret = process.env.JWT_TOKEN_SECRET
const ObjectId = mongoose.Types.ObjectId

export const userJWT = async (req: Request, res: Response, next: NextFunction) => {

    let { authorization, userType } = req.headers,
        result: any


    if (authorization) {
        try {
            let isverifyToken: any = jwt.verify(authorization, jwt_token_secret)

            if (isverifyToken?.category != userType) {
                return res.status(403).json(new apiResponse(403, 'Access Denied!', {}, {}))
            }

            result = await authenticationModel.findOne({ _id: new ObjectId(isverifyToken._id), isActive: true })

            req.headers.user = result

            return next()
        } catch (err) {
            if (err.message == "invalid signature") {
                return res.status(403).json(new apiResponse(403, 'Do not try a different token!', {}, {}))
            }
        }
    }
    else {
        return res.status(401).json(new apiResponse(401, 'We can not find tokens in header!', {}, {}))
    }

}