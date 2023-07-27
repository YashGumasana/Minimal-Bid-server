import { Request, Response } from "express";
import { authenticationModel } from "../database/models/authentication";
import { apiResponse, genderStatus } from "../common";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { reqInfo } from "../helper";

const ObjectId: any = mongoose.Types.ObjectId




export const signup = async (req: Request, res: Response) => {
    console.log("register");

    reqInfo(req)
    try {
        let body = req.body,
            otpFlag = 1,
            authToken = 0



        let [isAlready, userNameAlreadyExist]: any = await Promise.all([
            authenticationModel.findOne({
                email: body?.email, isActive: true
            }),

            authenticationModel.findOne({
                userName: { '$regex': body?.userName, '$options': 'i' },
                isActive: true
            })
        ])

        if (userNameAlreadyExist) {
            return res.status(409).json(new apiResponse(409, 'You have entered username is already exist!', {}, {}))
        }

        if (isAlready?.isBlock == true) {
            return res.status(409).json(new apiResponse(409, 'Your account has been blocked', {}, {}))
        }

        if (isAlready) {
            return res.status(409).json(new apiResponse(409, "You have entered email is already exist!", {}, {}))
        }

        const salt = bcryptjs.genSaltSync(8)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        body.password = hashPassword


        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                authToken = Math.round(Math.random() * 1000000)
                if (authToken.toString().length == 6) {
                    flag++;
                }

                let isAlreadyAssign: any = await authenticationModel.findOne({
                    userId: authToken
                })

                if (isAlreadyAssign?.userId != authToken) {
                    otpFlag = 0
                }
            }

            body.userId = authToken

            let user: any = await new authenticationModel(body).save()
            console.log("user", user);



            return res.status(200).json(new apiResponse(200, "Sign Up successfully", {}, {}))
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}

export const login = async (req: Request, res: Response) => {
    console.log("login");

    reqInfo(req)
    let body = req.body
    console.log(body);

    try {
        let response: any = await authenticationModel.findOne({
            email: body.email,
            isActive: true
        })

        if (!response) {
            return res.status(400).json(new apiResponse(400, 'Email is not found', {}, {}))
        }

        if (response?.isBlock == true) {
            return res.status(403).json(new apiResponse(403, 'Your account has been blocked', {}, {}))
        }

        const passwordMatch = await bcryptjs.compare(body.password, response.password)

        if (!passwordMatch) {
            return res.status(400).json(new apiResponse(400, 'You have entered an invalid password!', {}, {}))
        }

        const token = jwt.sign({
            _id: response._id,
            category: response.category,
            userId: response.userId,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, process.env.JWT_TOKEN_SECRET)

        const refresh_token = jwt.sign({
            _id: response._id,
            category: response.category,
            userId: response.userId,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, process.env.REFRESH_TOKEN_SECRET)

        console.log("token", refresh_token);



        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/auth/refresh_token',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
        })

        // response.token = token

        return res.status(200).json(new apiResponse(200, 'Login Successful!', { response, token }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const refresh_token = async (req: Request, res: Response) => {

    try {
        // console.log("req.cookies", req?.cookies?.refreshtoken);

        const rf_token = req.cookies?.refreshtoken
        if (!rf_token) {
            return res.status(400).json(new apiResponse(400, 'Please Login Now.', {}, {}))
        }

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err: any, response: any) => {
            if (err) {
                return res.status(400).json(new apiResponse(400, 'Please Login Now.', {}, {}))
            }

            const user = await authenticationModel.findById(response._id).select("-password")

            if (!user) {
                return res.status(404).json(new apiResponse(404, 'This user does not exist.', {}, {}))
            }

            const token = jwt.sign({
                _id: ObjectId(response._id),
                userId: response.userId,
                category: response.category,
                status: "Login",
                generatedOn: (new Date().getTime())
            }, process.env.JWT_TOKEN_SECRET)



            return res.status(200).json(new apiResponse(200, 'refresh_token retrive successfully', { user, token }, {}))

        })

    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))

    }
}




