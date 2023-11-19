import { ISubparameter } from '../parametrics/subparameters.interface'
import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementPromotion {
  id: string
  title: string
  code: string
  description: string
  reason: string
  comment: string
  promotionStartAt: string
  promotionEndAt: string
  status: boolean
  createdAt: string
  updatedAt: string
  creator: IManagementActorData | null
  updater: IManagementActorData | null

  user: IManagementActorData
  company: ISubparameter
  promotionType: ISubparameter
  promotionRequest: IManagementPromotionPromotionRequest
  promotionPayment: IManagementPromotionPromotionPayment
}

export interface IManagementPromotionPromotionRequest {
  id:               string
  code:             string
  title:            string
  description:      string
}

export interface IManagementPromotionPromotionPayment {
  id:               string
  amount:           number
  paymentDate:      string
  status:           boolean
}

export interface ICreatePromotionInput {
  code: string
  comment: string
  companyId: string
  description: string
  promotionEndAt: string
  userId: string
  title: string
  reason: string
  promotionTypeId: string
  promotionStartAt: string
  promotionRequestId: string
  promotionPaymentId: string
}

export interface IUpdatePromotionInput {
  id: string
  code?: string | null
  comment?: string | null
  companyId?: string | null
  description?: string | null
  promotionEndAt?: string | null
  userId?: string | null
  title?: string | null
  reason?: string | null
  promotionTypeId?: string | null
  promotionStartAt?: string | null
  promotionRequestId?: string | null
  promotionPaymentId?: string | null
}
