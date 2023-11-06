import { graphqlClient, getGendersQuery, revalidateTokenQuery } from '~/graphql'
import { getBearerAuthHeader } from '~/utils'

import { IAuthGender, IAuthResponse } from '~/interfaces'

interface ISigninData {
  email: string
  password: string
}

interface ISignupData {
  name: string
  paternalSurname: string
  maternalSurname: string
  birthdate: string
  email: string
  password: string
  genderId: string
}

export class AuthService {
  static signin = async ( data : ISigninData ) : Promise<IAuthResponse> => {
    const url = import.meta.env.PUBLIC_AUTH_API_URL
    const response = await fetch( `${ url }/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( data )
    } )
    return response.json()
  }

  static signup = async ( data : ISignupData ) : Promise<IAuthResponse> => {
    const url = import.meta.env.PUBLIC_AUTH_API_URL
    const response = await fetch( `${ url }/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( data )
    } )
    return response.json()
  }

  static revalidateToken = async ( jwt : string ) : Promise<IAuthResponse> => {
    return graphqlClient.query( { document: revalidateTokenQuery, requestHeaders: getBearerAuthHeader( jwt ) } )
  }

  static getGenders = async () : Promise<IAuthGender[]> => {
    const { genders } = await graphqlClient.query( { document: getGendersQuery } )
    return genders
  }
}
