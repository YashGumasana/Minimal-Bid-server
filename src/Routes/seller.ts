import express from 'express'
const router = express.Router()
import { sellerController } from '../controllers'
import * as validation from '../validation'
import { userJWT } from '../helper'

router.use(userJWT)
router.post('/uploadProduct', validation.product, sellerController.createProduct)
router.get('/getCreatedProducts', sellerController.getCreatedProducts)

export const sellerRouter = router