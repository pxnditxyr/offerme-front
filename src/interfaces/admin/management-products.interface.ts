import { ISubparameter } from '../parametrics/subparameters.interface'
import { IManagementCategory } from './management-categories.interface'
import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementProduct {
  id: string
  name: string
  description: string
  stock: number
  price: number
  code: string
  notes: string
  status: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  creator: IManagementActorData | null
  updater: IManagementActorData | null
  company: ISubparameter
  productType: ISubparameter

  images: IManagementProductImage[]
  categories: IManagementProductCategory[]
  promotionRequests: IManagementProductPromotionRequest[]
  discountProducts: IManagementProductDiscountProduct[]
}

export interface IManagementProductImage {
  id:     string
  alt:    string
  url:    string
  status: boolean
}

export interface IManagementProductCategory {
  id: string
  productId: string
  categoryId: string
  status: boolean
  product: IManagementProduct | null
  category: IManagementCategory | null
} 

export interface IManagementProductPromotionRequest {
  id:               string
  promotionRequestId: string
  productId:        string
  status:           boolean
}

export interface IManagementProductDiscountProduct {
  id: string
  productId: string
  userId: string
  promotionRequestId: string
  title: string
  description: string
  status: boolean
}

export interface ICreateProductInput {
  code: string
  companyId: string
  description: string
  name: string
  notes: string
  price: number
  productTypeId: string
  stock: number
}

export interface IUpdateProductInput {
  id: string
  code?: string | null
  companyId?: string | null
  description?: string | null
  name?: string | null
  notes?: string | null
  price?: number | null
  productTypeId?: string | null
  stock?: number | null
}

export interface ICreateProductImageInput {
  productId: string
  alt:       string
  url:       string
}

export interface ICreateProductCategoryInput {
  productId: string
  categoryId: string
}
