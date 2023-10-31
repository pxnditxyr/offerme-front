export interface IUserAuthorizationSchema {
  [ key : string ]: {
    entrypoint: string
  }
}

export const userAuthorizationSchema : IUserAuthorizationSchema = {
  'ADMIN': {
    entrypoint: '/management/dashboard',
  },
  'USER': {
    entrypoint: '/',
  },
  'SELLER': {
    entrypoint: '/',
  },
  'COMPANY_REPRESENTATIVE': {
    entrypoint: '/',
  },
}
