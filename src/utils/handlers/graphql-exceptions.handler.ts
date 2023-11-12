import { IGraphQLErrorInfo, IGraphQLValidationError } from '~/interfaces'

export const graphqlExceptionsHandler = ( error : any ) : string => {
  if ( !error.response ) return error.message
  if ( ( error.response.errors.length === 1 ) && ( error.response.errors[ 0 ].extensions.originalError ) ) {
    const errors = ( error.response.errors as IGraphQLValidationError[] ).map( ( error ) => `${ error.extensions.originalError.message }, on request: ${ error.path }` )
    return errors.join( '\n' )
  }
  const errors = ( error.response.errors as IGraphQLErrorInfo[] ).map( ( error ) => `${ error.message }, on request: ${ error.path }` )
  return errors.join( '\n' )
}
