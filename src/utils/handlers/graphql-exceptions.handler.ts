import { IGraphQLErrorInfo } from '~/interfaces'

export const graphqlExceptionsHandler = ( error : any ) : string => {
  if ( !error.response ) return error.message
  const errors = ( error.response.errors as IGraphQLErrorInfo[] ).map( ( error ) => `${ error.message }, on request: ${ error.path }` )
  return errors.join( '\n' )
}
