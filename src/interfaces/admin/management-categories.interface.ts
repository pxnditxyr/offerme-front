import { IManagementActorData } from './management-users-data.interfaces'

export interface IManagementCategoriesStatus {
  categories: IManagementCategory[]
  isLoading: boolean
  errors: string | null
}

export interface IManagementCategory {
  id: string
  name: string
  description: string
  order: number
  status: boolean
  createdAt: string
  updatedAt: string
  parent: IManagementCategory | null
  creator: IManagementActorData | null
  updater: IManagementActorData | null
  children: IManagementCategory[]
  images: IManagementCategoryImage[]
}

export interface IManagementCategoryImage {
  id: string
  url: string
  alt: string
  status: boolean
}

export interface ICreateCategoryInput {
  description: string
  name:        string
  order:       number
  parentId?:   string | null
}

export interface IUpdateCategoryInput {
  id:           string
  description?: string | null
  name?:        string | null
  order?:       number | null
  parentId?:    string | null
  status?:      boolean | null
}

export interface ICreateCategoryImagesInput {
  alt: string
  categoryId: string
  url: string
}
