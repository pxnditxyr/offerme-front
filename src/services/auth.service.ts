import { graphqlClient, getGendersQuery, revalidateTokenQuery } from '~/graphql'
import { getBearerAuthHeader } from '~/utils'

import { IAuthGender, IAuthResponse, IErrorResponse, ISignupData } from '~/interfaces'
import { ISigninData } from '~/interfaces'

export class AuthService {
  static signin = async ( data : ISigninData ) : Promise<IAuthResponse | IErrorResponse> => {
    const url = import.meta.env.PUBLIC_AUTH_API_URL
    const response = await fetch( `${ url }/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( data )
    } )
    return response.json()
  }

  static signup = async ( data : ISignupData ) : Promise<IAuthResponse | IErrorResponse> => {
    const url = import.meta.env.PUBLIC_AUTH_API_URL
    const response = await fetch( `${ url }/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( data )
    } )
    return response.json()
  }

  static revalidateToken = async ( jwt : string ) : Promise<{ revalidateToken: IAuthResponse }> => {
    const response = await graphqlClient.query( { document: revalidateTokenQuery, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response
  }

  static getGenders = async () : Promise<IAuthGender[]> => {
    const { genders } = await graphqlClient.query( { document: getGendersQuery } )
    return genders
  }
}
