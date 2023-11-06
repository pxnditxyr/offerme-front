import { request, gql } from 'graphql-request'
import type { GraphQLClientAdapter } from './graphql-client.abstract'

import { IGraphQLRequest } from '~/interfaces'

export class GraphQLCLient implements GraphQLClientAdapter {
  private readonly request = request

  constructor (
    private readonly uri : string
  ) {}
  
  async query ( { document, variables = {}, requestHeaders = {} } : IGraphQLRequest ): Promise<any> {
    const documentParsed = gql`${ document }`
    return await this.request( this.uri, documentParsed, variables, requestHeaders )
  }

  async mutation ( { document, variables = {}, requestHeaders = {} } : IGraphQLRequest ): Promise<any> {
    const documentParsed = gql`${ document }`
    return await this.request( this.uri, documentParsed, variables, requestHeaders )
  }
}
