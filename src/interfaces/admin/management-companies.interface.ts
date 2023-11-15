import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementCompany {
  id:                string
  name:              string
  description:       string
  documentNumber:    string
  website:           string
  email:             string
  foundedAt:         string
  status:            boolean
  createdAt:         string
  updatedAt:         string
  companyType:       IManagementCompanyType
  documentType:      IManagementDocumentType
  creator:           IManagementActorData | null
  updater:           IManagementActorData | null
  logos:             IManagementCompanyLogo[]
  products:          IManagementCompanyProduct[]
  users:             IManagementCompanyUser[]
  promotionRequests: IManagementCompanyPromotionRequest[]
  promotions:        IManagementCompanyPromotion[]
}

export interface IManagementCompanyType {
  id:   string
  name: string
}

export interface IManagementDocumentType {
  id:   string
  name: string
}

export interface IManagementCompanyLogo {
  id:     string
  alt:    string
  url:    string
  status: boolean
}

export interface IManagementCompanyProduct {
  id:          string
  code:        string
  name:        string
  price:       number
  description: string
}
  
export interface IManagementCompanyUser {
  id:    string
  email: string
}

export interface IManagementCompanyPromotionRequest {
  id:               string
  title:            string
  status:           boolean
  promotionStartAt: string
  promotionEndAt:   string
  inversionAmount:  number
  description:      string
  createdAt:        string
}

export interface IManagementCompanyPromotion {
  id:                 string
  title:              string
  description:        string
  status:             boolean
  promotionStartAt:   string
  promotionEndAt:     string
  promotionPaymentId: string
  createdAt:          string
}

export interface ICreateCompanyInput {
  name:            string
  description:     string
  companyTypeId:   string
  documentNumber?: string | null
  documentTypeId?: string | null
  foundedAt?:      string | null
  email?:          string | null
  website?:        string | null
}

export interface IUpdateCompanyInput {
  id:              string
  companyTypeId?:  string | null
  description?:    string | null
  documentNumber?: string | null
  documentTypeId?: string | null
  foundedAt?:      string | null
  email?:          string | null
  website?:        string | null
  name?:           string | null
}

export interface ICreateCompanyLogoInput {
  companyId: string
  alt:       string
  url:       string
}
