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
    entrypoint: '/seller/dashboard',
  },
  'COMPANY_REPRESENTATIVE': {
    entrypoint: '/company/dashboard',
  },
  'AUTH': {
    entrypoint: '/signin',
  },
}
