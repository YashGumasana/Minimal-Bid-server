import { Request, Response } from 'express'
import Joi from 'joi'
import { isValidObjectId } from 'mongoose'

import { apiResponse } from '../common'

export const signup = async (req: Request, res: Response, next: any) => {

    const schema = Joi.object({
        userName: Joi.string().error(new Error('user name is string!')),
        fullName: Joi.string().error(new Error('full name is string!')),
        email: Joi.string().error(new Error('email is string!')),
        phoneNumber: Joi.number().error(new Error('phonenumber is number!')),
        password: Joi.string().error(new Error('password is string!')),
        category: Joi.number().error(new Error('category is number!')),
        gender: Joi.number().error(new Error('gender is number!')),
    })
    schema.validateAsync(req.body).then(result => {
        console.log("result", result);

        return next()
    }).catch(error => {
        console.log(error);

        res.status(400).json(new apiResponse(400, error.message, {}, {}))
    })
}


export const login = async (req: Request, res: Response, next: any) => {

    const schema = Joi.object({
        email: Joi.string().error(new Error('email is string!')),
        password: Joi.string().error(new Error('password is string!')),
    })
    schema.validateAsync(req.body).then(result => {
        return next()
    }).catch(error => {
        console.log(error);

        res.status(400).json(new apiResponse(400, error.message, {}, {}))
    })
}