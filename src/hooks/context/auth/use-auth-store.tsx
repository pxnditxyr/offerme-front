import { $, useComputed$, useContext } from '@builder.io/qwik'
import type { Action, Cookie, RequestEventAction, RequestEventLoader } from '@builder.io/qwik-city'
import { AuthContext } from '~/context'
import { ISigninData, ISignupData } from '~/interfaces'
import { AuthService } from '~/services'
import { graphqlExceptionsHandler } from '~/utils'

export const useAuthStore = () => {
  const authState = useContext( AuthContext )

  const signin = $( async ( data : ISigninData, { cookie } : RequestEventAction ) => {
    try {
      const response = await AuthService.signin( data )
      if ( 'error' in response ) {
        authState.status = 'unauthenticated'
        authState.user = null
        authState.token = null
        cookie.delete( 'jwt', { path: '/' } )
        return {
          success: false,
          error: response.message,
        }
      }
      authState.status = 'authenticated'
      authState.user = response.user
      authState.token = response.token
      cookie.set( 'jwt', response.token, { secure: true, path: '/' } )
    } catch ( error : any ) {
      console.error( error )
      authState.status = 'server-error'
    } 
  } )

  const signup = $( async ( data : ISignupData, { cookie } : RequestEventAction ) => {
    try {
      const response = await AuthService.signup( data )
      if ( 'error' in response ) {
        authState.status = 'unauthenticated'
        authState.user = null
        authState.token = null
        cookie.delete( 'jwt', { path: '/' } )
        return
      }
      authState.status = 'authenticated'
      authState.user = response.user
      authState.token = response.token
      cookie.set( 'jwt', response.token, { secure: true, path: '/' } )
    } catch ( error : any ) {
      console.error( error )
      authState.status = 'server-error'
    }
  } )

  const revalidateToken = $( async ( token : string ) => {
    try {
      const response = await AuthService.revalidateToken( token )
      if ( response.revalidateToken ) {
        authState.status = 'authenticated'
        authState.user = response.revalidateToken.user
        authState.token = response.revalidateToken.token
      }
    } catch ( error : any ) {
      console.error( error )
      const errors = graphqlExceptionsHandler( error )
      if ( errors.includes( 'Unauthorized' ) ) {
        authState.status = 'unauthenticated'
        authState.user = null
        authState.token = null
        return
      }
      authState.status = 'server-error'
    }
  } )

  const signout = $( ( action : any  ) => {
    authState.status = 'unauthenticated'
    authState.user = null
    authState.token = null
    action()
  } )

  return {
    status: useComputed$( () => authState.status ),
    user: useComputed$( () => authState.user ),
    token: useComputed$( () => authState.token ),

    signin,
    signup,
    signout,
    revalidateToken
  }

}
