import { IGraphQLErrorInfo } from '~/interfaces'

export const graphqlExceptionsHandler = ( error : any ) : string => {
  console.log( 'graphqlExceptionsHandler' )
  console.log( { error } )
  // const errors = ( error.response.errors as IGraphQLErrorInfo[] ).map( ( error ) => `${ error.message }, this on query: ${ error.path }` )
  // return errors.join( '\n' )
  return 'hola'
}
