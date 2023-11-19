import { ISubparameter } from '../parametrics/subparameters.interface'
import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementPromotionPayment {
  id: string
  amount: number
  voucher: string | null
  paymentDate: string
  status: boolean
  createdAt: string
  updatedAt: string
  creator: IManagementActorData | null
  updater: IManagementActorData | null
  paymentMethod: ISubparameter | null
}

export interface ICreatePromotionPaymentInput {
  amount:             number
  voucher:            string
  paymentDate:        string | null
  creditCardId?:      string | null
  paymentMethodId:    string
  promotionRequestId: string
}

export interface IUpdatePromotionPaymentInput {
  id:                  string
  amount?:             number
  voucher?:            string
  paymentDate?:        string | null
  creditCardId?:       string | null
  paymentMethodId?:    string
  promotionRequestId?: string
}
