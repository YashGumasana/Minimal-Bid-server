import { Request, Response } from "express";
import { reqInfo } from "../../helper";
import { apiResponse } from "../../common";
import { ObjectId, Types } from "mongoose";
import { productModel } from "../../database/models/product";
import { bidpriceModel } from "../../database";
const ObjectId: any = Types.ObjectId


export const getProductList = async (req: Request, res: Response) => {
    reqInfo(req)
    let match: any = {
        isActive: true,
    },
        response: any, count: any, user: any = req.header('user')

    try {

        response = await productModel.find({
            isActive: true,
            appliedBy: { $nin: [new ObjectId(user._id)] }
        })

        return res.status(200).json(new apiResponse(200, "get product successfully", { product_data: response }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const postBidPrice = async (req: Request, res: Response) => {

    reqInfo(req)
    let user: any = req.header('user'),
        productId = req.body.productId,
        body: any = req.body


    console.log('req.body', req.body);

    try {

        body.createdBy = new ObjectId(user?._id)

        let updateRes = await productModel.findByIdAndUpdate({
            _id: productId
        }, { $push: { appliedBy: user._id } }, { new: true })

        body.productBy = updateRes.createdBy

        let bidPrice: any = await new bidpriceModel(body).save()



        return res.status(200).json(new apiResponse(200, 'Applied Bid Successfully', {
            updateRes, bidPrice
        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}

export const getPastBid = async (req: Request, res: Response) => {
    reqInfo(req)
    let user: any = req.header('user'), response: any
    let match: any = {
        isActive: true,
        createdBy: user._id
    }
    try {

        [response] = await Promise.all([
            bidpriceModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "products",
                        let: { productId: "$productId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$productId']
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "product"
                    }
                },
                {
                    $project: { product: 1, bidPrice: 1 }
                }
            ])
        ])

        return res.status(200).json(new apiResponse(200, 'past bid successfully fetched', {
            past_bid_data: response,
        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }

}

