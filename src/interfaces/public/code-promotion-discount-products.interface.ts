import { IGQLErrorResponse } from "../graphql/graphql-error-response.interface"

export interface IPublicCodePromotionDiscountProductsService {
  publicCodePromotionDiscountProducts: IPublicCodePromotionDiscountProducts[] | IGQLErrorResponse
  publicDiscountProducts: IPublicDiscountProducts[] | IGQLErrorResponse
  publicProducts: IPublicProducts[] | IGQLErrorResponse
  publicPromotions: IPublicPromotions[] | IGQLErrorResponse
}

export interface IPublicCodePromotionDiscountProducts {
  id: string
  code: string
  discountProductId: string
  isUsed: boolean
  isRedeemed: boolean
  status: boolean
}

export interface IPublicDiscountProducts {
  id: string
  productId: string
  title: string
  description: string
  discountPercentage: number
  discountAmount: number
  discountPrice: number
  promotionRequestId: string
  status: boolean
}

export interface IPublicProducts {
  id: string
  name: string
  description: string
  companyId: string
  productTypeId: string
  stock: number
  price: number
  code: string
  notes: string
  status: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  company: {
    id: string
    name: string
  }
  productType: {
    id: string
    name: string
  }
  images: {
    id: string
    url: string
    alt: string
    status: boolean
  }[]
}

export interface IPublicPromotions {
  id: string
  companyId: string
  promotionRequestId: string
  title: string
  code: string
  description: string
  promotionTypeId: string
  reason: string
  comment: string
  promotionStartAt: string
  promotionEndAt: string
  status: boolean
}
