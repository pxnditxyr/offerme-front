import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementDiscountProduct {
  id: string
  productId: string
  userId: string
  promotionRequestId: string
  title: string
  description: string
  discountPercentage: number
  discountAmount: number
  discountPrice: number
  status: boolean
  createdAt: string
  updatedAt: string
  creator: IManagementActorData | null
  updater: IManagementActorData | null
}

export interface ICreateDiscountProductInput {
  description: string
  discountAmount: number
  discountPercentage: number
  discountPrice: number
  productId: string
  promotionRequestId: string
  title: string
}

export interface IUpdateDiscountProductInput {
  id:                  string
  description?:        string | null
  discountAmount?:     number | null
  discountPercentage?: number | null
  discountPrice?:      number | null
  productId?:          string | null
  promotionRequestId?: string | null
  title?:              string | null
}
