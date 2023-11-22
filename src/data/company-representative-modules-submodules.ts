const linkPrefix = '/company/modules'

export const companyRepresentativeMenuData = [
  {
    label: 'My Company',
    name: 'my-company',
    isExpanded: false,
    crud: false,
    link: `${ linkPrefix }/my-company`,
  },
  {
    label: 'My Company Products',
    name: 'products',
    isExpanded: false,
    crud: true,
    link: `${ linkPrefix }/products`,
  },
  {
    label: 'Our Users',
    name: 'users',
    isExpanded: false,
    crud: true,
    link: `${ linkPrefix }/users`,
  },
  {
    label: 'Promotion Requests',
    name: 'promotion-requests',
    isExpanded: false,
    crud: true,
    link: `${ linkPrefix }/promotion-requests`,
  },
  // {
  //   label: 'Reviews',
  //   name: 'reviews',
  //   isExpanded: false,
  //   crud: false,
  //   link: `${ linkPrefix }/reviews`,
  // },
]
