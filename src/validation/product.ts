import Joi from 'joi'
import { Request, Response } from 'express'
import { apiResponse } from '../common'


export const product = async (req: Request, res: Response, next: any) => {

    const schema = Joi.object({
        productName: Joi.string().error(new Error('productName is string!')),
        productDescription: Joi.string().error(new Error('productDescription is string!')),
        productCategory: Joi.string().error(new Error('productCategory is string!')),
        productImage: Joi.string().error(new Error('password is string!')),
        productPrice: Joi.number().error(new Error('password is number!')),
    })
    schema.validateAsync(req.body).then(result => {
        return next()
    }).catch(error => {
        console.log(error);

        res.status(400).json(new apiResponse(400, error.message, {}, {}))
    })
}