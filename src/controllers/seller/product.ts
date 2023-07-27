import { Request, Response } from "express";
import { reqInfo } from "../../helper";
import { apiResponse } from "../../common";
import { ObjectId, Types } from "mongoose";
import { productModel } from "../../database/models/product";
const ObjectId: any = Types.ObjectId


export const createProduct = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let body: any = req.body,
            user: any = req.header('user')

        body.createdBy = new ObjectId(user?._id)

        let product: any = await new productModel(body).save()

        return res.status(200).json(new apiResponse(200, "product created successful", {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const getCreatedProducts = async (req: Request, res: Response) => {
    reqInfo(req)
    let user: any = req.header('user'), response: any
    let match: any = {
        isActive: true,
        createdBy: user._id
    }
    try {

        [response] = await Promise.all([
            productModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "bidprices",
                        let: { appliedBy: "$appliedBy", productId: "$_id" },

                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $in: ['$createdBy', '$$appliedBy']
                                            },
                                            { $eq: ['$productId', '$$productId'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: "users",
                                    let: { id: "$createdBy" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        {
                                                            $eq: ['$_id', '$$id']
                                                        }
                                                    ]
                                                }
                                            }
                                        }

                                    ],
                                    as: "user"
                                }
                            }
                        ],
                        as: "bidPrice"
                    },

                },

                {
                    $project: { productName: 1, productDescription: 1, productCategory: 1, productPrice: 1, productImage: 1, bidPrice: 1, }
                }
            ])
        ])

        return res.status(200).json(new apiResponse(200, 'past bid successfully fetched', {
            created_product_data: response,
        }, {}))

    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}
