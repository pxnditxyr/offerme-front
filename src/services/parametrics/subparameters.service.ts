import { getSubparametersByParameterName, graphqlClient } from '~/graphql'

interface IGetSubparametersByParameterNameParams {
  parameterName: string
  status?: boolean | null
}

export class SubparametersService {
  static findAllByParameterName = async ( { parameterName, status = null } : IGetSubparametersByParameterNameParams )  => {
    const response = await graphqlClient.query( { document: getSubparametersByParameterName, variables: { parameterName, status } } )
    return response.subparametersByParameterName
  }
}
