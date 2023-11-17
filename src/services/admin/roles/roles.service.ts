import { graphqlClient } from '~/graphql'
import { getRoles } from '~/graphql/queries/admin/roles/roles.queries'
import { getBearerAuthHeader } from '~/utils'

export class ManagementRolesService {
  static findAll = async ( jwt : string, status : boolean ) => {
    const response = await graphqlClient.query({ document: getRoles, variables: { status }, requestHeaders: getBearerAuthHeader( jwt ) })
    return response.roles
  }
}
