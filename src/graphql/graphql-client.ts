import { GraphQLCLient } from '~/adapters'

const uri = import.meta.env.PUBLIC_GRAPHQL_URI
const graphqlClient = new GraphQLCLient( uri )

export { graphqlClient }
