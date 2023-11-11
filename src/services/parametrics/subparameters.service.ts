import { getSubparametersByParameterName, graphqlClient } from '~/graphql'

export class SubparametersService {
  static findAllByParameterName = async ( parameterName : string ) => {
    const response = await graphqlClient.query( { document: getSubparametersByParameterName, variables: { parameterName } } )
    return response.subparametersByParameterName
  }
}
