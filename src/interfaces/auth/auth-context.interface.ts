import { IUser } from '../user.interface'

export interface IAuthResponse {
  user: IUser
  token: string
}

export interface IErrorResponse {
  error: Record<string, unknown>
  message: string
}

type TAuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'server-error'

export interface IAuthState {
  user: IUser | null
  token: string | null
  status: TAuthStatus
}
