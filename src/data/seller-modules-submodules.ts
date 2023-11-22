const linkPrefix = '/seller/modules'

export const sellerMenuData = [
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
    crud: false,
    link: `${ linkPrefix }/products`,
  },
  {
    label: 'Redeem Coupons',
    name: 'redeem-coupons',
    isExpanded: false,
    crud: false,
    link: `${ linkPrefix }/redeem-coupons`,
  }
  // {
  //   label: 'Reviews',
  //   name: 'reviews',
  //   isExpanded: false,
  //   crud: false,
  //   link: `${ linkPrefix }/reviews`,
  // },
]
