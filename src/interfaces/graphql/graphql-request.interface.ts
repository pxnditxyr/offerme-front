import { IObject } from './object.interface'

export interface IGraphQLRequest {
  document: string
  variables?: IObject
  requestHeaders?: IObject
}

export interface IGraphQLErrorInfo {
  message: string
  path: string
}
