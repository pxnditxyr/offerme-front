import { IUser } from './user.interface'

export interface IAuthResponse {
  user: IUser
  token: string
}

type TAuthStatus = 'authenticated' | 'unauthenticated' | 'loading'

export interface IAuthState {
  user: IUser | null
  token: string | null
  status: TAuthStatus
}
