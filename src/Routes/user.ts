import express from 'express'
const router = express.Router()
import { sellerController, userController } from '../controllers'
import * as validation from '../validation'
import { userJWT } from '../helper'

router.use(userJWT)
router.get('/getProductList', userController.getProductList)
router.post('/postBidPrice', userController.postBidPrice)
router.get('/getPastBid', userController.getPastBid)

export const userRouter = router