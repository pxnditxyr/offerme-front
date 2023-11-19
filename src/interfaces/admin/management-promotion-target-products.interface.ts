import { ISubparameter } from '../parametrics/subparameters.interface'
import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementPromotionTargetProduct {
  id: string
  description: string
  promotionRequestId: string
  productId: string
  status: boolean
  createdAt: string
  updatedAt: string
  creator: IManagementActorData | null
  updater: IManagementActorData | null
  paymentMethod: ISubparameter | null
}

export interface ICreatePromotionTargetProductInput {
  description: string
  productId: string
  promotionRequestId: string
}

export interface IUpdatePromotionTargetProductInput {
  id:                  string
  productId?:          string | null
  promotionRequestId?: string | null
}
