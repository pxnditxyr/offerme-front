import { ISubparameter } from '../parametrics/subparameters.interface'
import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementPromotionRequest {
  id: string
  title: string
  code: string
  description: string
  reason: string
  comment: string
  promotionStartAt: string
  promotionEndAt: string
  inversionAmount: number
  status: boolean
  createdAt: string
  updatedAt: string

  requestingUser: IManagementActorData
  company: ISubparameter
  promotionType: ISubparameter

  creator: IManagementActorData | null
  updater: IManagementActorData | null
  currency: ISubparameter

  images: IManagementPromotionImage[]
  targetProducts: IManagementPromotionRequestTargetProduct[]
  promotionStatus: IManagementPromotionRequestStatus
  promotionPayments: IManagementPromotionRequestPayment[]
  discountProducts: IManagementPromotionRequestDiscountProduct[]
}

export interface IManagementPromotionImage {
  id: string
  url: string
  alt: string
  status: boolean
}

export interface IManagementPromotionRequestTargetProduct {
  id: string
  productId: string
  description: string
  status: boolean
}

export interface IManagementPromotionRequestStatus {
  id: string
  adminApprovedBy: string
  adminApprovedAt: string
  adminApprovedStatus: boolean
  adminComment: string
  adminReason: string
  adminRejectedBy: string
  adminRejectedAt: string
  adminRejectedStatus: boolean
  status: boolean
}

export interface IManagementPromotionRequestPayment {
  id: string
  paymentDate: string
  amount: number
  voucher: string
  paymentMethodId: string
  status: boolean
}

export interface IManagementPromotionRequestDiscountProduct {
  id: string
  productId: string
  title: string
  description: string
  discountAmount: number
  discountPercentage: number
  discountPrice: number
  status: boolean
}

export interface ICreatePromotionRequestInput {
  code: string
  comment: string
  companyId: string
  currencyId: string
  description: string
  inversionAmount: number
  promotionEndAt: string
  promotionStartAt: string
  promotionTypeId: string
  reason: string
  title: string
}

export interface IUpdatePromotionRequestInput {
  id: string
  code?: string | null
  comment?: string | null
  companyId?: string | null
  currencyId?: string | null
  description?: string | null
  inversionAmount?: number | null
  promotionEndAt?: string | null
  promotionStartAt?: string | null
  promotionTypeId?: string | null
  reason?: string | null
  title?: string | null
}

export interface ICreatePromotionImageInput {
  promotionRequestId: string
  alt:       string
  url:       string
}
