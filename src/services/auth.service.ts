import { graphqlClient, getGendersQuery, revalidateTokenQuery } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { IAuthGender, IAuthResponse, IErrorResponse, IGQLErrorResponse, ISignupData } from '~/interfaces'
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

  static newRevalidateToken = async ( jwt : string ) : Promise<IAuthResponse | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query( { document: revalidateTokenQuery, requestHeaders: getBearerAuthHeader( jwt ) } )
      return response.revalidateToken
    } catch ( error ) {
      return {
        errors: graphqlExceptionsHandler( error ),
      }
    }
  }

  static getGenders = async () : Promise<IAuthGender[]> => {
    const { genders } = await graphqlClient.query( { document: getGendersQuery } )
    return genders
  }
}
