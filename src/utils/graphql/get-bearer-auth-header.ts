
export const getBearerAuthHeader = ( jwt : string ) => ({ authorization: `Bearer ${ jwt }` })
