const linkPrefix = '/management/modules'

export const adminMenuData = [
  {
    label: 'Categories',
    name: 'categories',
    isExpanded: false,
    crud: true,
    link: `${ linkPrefix }/categories`,
  },
  {
    label: 'Companies',
    name: 'companies',
    isExpanded: false,
    crud: true,
    link: `${ linkPrefix }/companies`,
  },
  {
    label: 'Products',
    name: 'products',
    isExpanded: false,
    crud: true,
    link: `${ linkPrefix }/products`,
  },
  {
    label: 'Parameters',
    name: 'parameters',
    isExpanded: false,
    crud: true,
    link: `${ linkPrefix }/parameters`,
  },
  {
    label: 'Users',
    name: 'users',
    isExpanded: false,
    crud: true,
    link: `${ linkPrefix }/users`,
  },
  {
    label: 'Promotions',
    name: 'promotions',
    isExpanded: false,
    crud: false,
    link: `${ linkPrefix }/promotions`,
    submenu: [
      {
        label: 'Promotions',
        name: 'promotions-sub',
        isExpanded: false,
        crud: true,
        link: `${ linkPrefix }/promotions`,
      },
      {
        label: 'Promotion Requests',
        name: 'promotion-requests',
        isExpanded: false,
        crud: true,
        link: `${ linkPrefix }/promotion-requests`,
      }
    ],
  },
  // {
  //   label: 'Reviews',
  //   name: 'reviews',
  //   isExpanded: false,
  //   crud: false,
  //   link: `${ linkPrefix }/reviews`,
  // },
]
