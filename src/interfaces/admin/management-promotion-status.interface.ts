import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementPromotionStatus {
  id: string
  adminApprovedStatus: boolean
  adminApprovedAt: string | null
  adminApprovedBy: string | null
  adminRejectedStatus: boolean
  adminRejectedAt: string | null
  adminRejectedBy: string | null
  adminComment: string | null
  adminReason: string | null
  status: boolean
  createdAt: string
  updatedAt: string
  promotionRequest: IManagementPromotionStatusPromotionRequest | null
  adminApproved: IManagementActorData | null
  adminRejected: IManagementActorData | null
  creator: IManagementActorData | null
  updater: IManagementActorData | null
}

export interface IManagementPromotionStatusPromotionRequest {
  id: string
  title: string
  description: string
  code: string
  inversionAmount: number
  currencyId: string
  comment: string
  status: boolean
}

export interface ICreatePromotionStatusInput {
  promotionRequestId: string
}

export interface IUpdatePromotionStatusInput {
  id: string
  adminComment: string
  adminReason: string
}
