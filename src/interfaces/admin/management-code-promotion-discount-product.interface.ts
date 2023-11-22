import { ISubparameter } from '../parametrics/subparameters.interface'
import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementCodePromotionDiscountProduct {
  id: string
  code: string
  isUsed: boolean
  usedAt: string
  isRedeemed: boolean
  redeemedAt: string
  status: ISubparameter
  createdAt: string
  updatedAt: string
  discountProduct: IManagementCodePromotionDiscountProductDiscountProduct
  used: IManagementActorData
  creator: IManagementActorData
  updater: IManagementActorData
  redeemed: IManagementActorData
}

export interface IManagementCodePromotionDiscountProductDiscountProduct {
  id:            string
  discountPrice: number
  title:         string
  description:   string
  promotionRequestId: string
}

export interface ICreateCodePromotionDiscountProductInput {
  quantity:          number
  discountProductId: string
}

export interface IUpdateCodePromotionDiscountProductInput {
  id:                  string
  productId?:          string | null
  promotionRequestId?: string | null
}
