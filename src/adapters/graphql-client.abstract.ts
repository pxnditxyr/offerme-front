import { IGraphQLRequest } from '~/interfaces'

export abstract class GraphQLClientAdapter {
  abstract query ( requestOptions : IGraphQLRequest ): Promise<any>
  abstract mutation ( requestOptions : IGraphQLRequest ): Promise<any>
}


